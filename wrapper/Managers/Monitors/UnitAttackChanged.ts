import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { EventPriority } from "../../Enums/EventPriority"
import { GameActivity } from "../../Enums/GameActivity"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { Entity } from "../../Objects/Base/Entity"
import { FakeUnit } from "../../Objects/Base/FakeUnit"
import { Unit, Units } from "../../Objects/Base/Unit"
import { Tower } from "../../Objects/Buildings/Tower"
import { GameState } from "../../Utils/GameState"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"
import { TaskManager } from "../TaskManager"

new (class CUnitAttackChanged {
	protected get HasDebug(): boolean {
		return (globalThis as any)?.DEBUGGER_INSTALLED ?? false
	}

	private readonly attackLockUntil = new Map<Unit, number>()
	private readonly heroGainAggroTargetIndex = new Map<Unit, number>()

	private readonly attackActivities = [
		GameActivity.ACT_DOTA_ATTACK,
		GameActivity.ACT_DOTA_ATTACK2,
		GameActivity.ACT_DOTA_ATTACK_EVENT
	]

	constructor() {
		EventsSDK.on("GameEvent", this.GameEvent.bind(this), EventPriority.IMMEDIATE)
		EventsSDK.on(
			"PostDataUpdate",
			this.PostDataUpdate.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"PrepareUnitOrders",
			this.PrepareUnitOrders.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitAnimationEnd",
			this.UnitAnimationEnd.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"UnitAnimation",
			this.UnitAnimation.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"NetworkActivityChanged",
			this.NetworkActivityChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"LifeStateChanged",
			this.LifeStateChanged.bind(this),
			EventPriority.IMMEDIATE
		)
		EventsSDK.on(
			"EntityDestroyed",
			this.EntityDestroyed.bind(this),
			EventPriority.IMMEDIATE
		)
	}
	protected PostDataUpdate(deltaTime: number) {
		if (deltaTime === 0) {
			return
		}
		this.attackLockUntil.forEach((delay, attacker) => {
			if (GameState.RawGameTime > delay - deltaTime) {
				this.attackStopped(attacker, false)
			}
		})
	}
	protected LifeStateChanged(entity: Entity) {
		if (!(entity instanceof Unit) || entity.IsAlive) {
			return
		}
		this.attackCancelled(entity)
		this.attackStopped(entity, true)
		this.heroGainAggroTargetIndex.delete(entity)
		this.attackLockUntil.delete(entity)
	}
	protected EntityDestroyed(entity: Entity) {
		if (entity instanceof Unit) {
			this.attackCancelled(entity, false)
			this.attackStopped(entity, true, false)
			this.attackLockUntil.delete(entity)
			this.heroGainAggroTargetIndex.delete(entity)
		}
	}
	protected NetworkActivityChanged(source: Unit) {
		if (!this.attackActivities.includes(source.NetworkActivity)) {
			this.attackStopped(source, true)
		}
	}
	protected PrepareUnitOrders(order: ExecuteOrder) {
		if (order.Queue) {
			return
		}
		switch (order.OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET: {
				this.setTarget(order.Issuers, order.Target)
				break
			}
			case dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_STOP: {
				this.dropTarget(order.Issuers)
				// handle some logic examples "stop channeling" & etc.
				break
			}
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET: {
				this.dropTarget(order.Issuers)
				break
			}
		}
	}
	protected UnitAnimationEnd(source: Unit | FakeUnit, _snap: boolean) {
		if (source instanceof Unit) {
			this.attackStopped(source, this.isCancelledAttack(source))
		}
	}
	protected UnitAnimation(
		source: Unit | FakeUnit,
		seqVar: number,
		_playBackRate: number,
		_castPoint: number,
		_type: number,
		activity: number,
		_lagCompensationTime: number,
		rawCastPoint: number
	) {
		if (!(source instanceof Unit)) {
			return
		}
		const animation = source.GetAnimation(activity, seqVar)
		if (animation === undefined) {
			this.handlerErrorMessage("animation AnimationsData", source, activity, seqVar)
			this.attackStopped(source, true)
			return
		}
		this.attackStarted(
			source,
			rawCastPoint,
			animation.activities.map(activityData => activityData.name)
		)
	}
	protected GameEvent(name: string, obj: any) {
		if (name !== "dota_hero_on_gain_aggro") {
			return
		}
		const attacker = EntityManager.EntityByIndex(obj.entindex_attacker)
		if (!(attacker instanceof Unit)) {
			return
		}
		if (attacker.IsValid && !attacker.IsAttacking) {
			this.heroGainAggroTargetIndex.set(attacker, obj.entindex_hero)
		}
	}
	private attackStarted(source: Unit, rawCastPoint: number, animationNames: string[]) {
		if (!source.IsAlive) {
			return
		}
		if (!source.IsControllable && !source.IsTower) {
			source.TargetIndex_ = this.findTargetByAngle(source)
		}
		if (source instanceof Tower) {
			source.TargetIndex_ = source.TowerAttackTarget_
		} else {
			source.IsAttacking = true
		}
		if (
			source.IsControllable &&
			source.TargetIndex_ === EntityManager.INVALID_INDEX
		) {
			source.TargetIndex_ = this.findTargetByAngle(source)
		}
		const tick = GameState.TickInterval
		const time = Math.ceil(rawCastPoint / tick) * tick
		this.attackLockUntil.set(source, GameState.RawGameTime + time)
		EventsSDK.emit("AttackStarted", false, source, time, animationNames)
	}
	private attackStopped(source: Unit, isCancelled: boolean, emitEvent = true) {
		if (!this.attackLockUntil.has(source)) {
			return
		}
		source.IsAttacking = false
		source.TargetIndex_ = EntityManager.INVALID_INDEX
		this.attackLockUntil.delete(source)
		this.heroGainAggroTargetIndex.delete(source)
		if (emitEvent) {
			EventsSDK.emit("AttackEnded", false, source, isCancelled)
		}
	}
	private setTarget(issuers: Unit[], entity: Nullable<number | Entity>) {
		let index = EntityManager.INVALID_INDEX
		if (entity instanceof Entity || typeof entity === "number") {
			index = typeof entity === "number" ? entity : entity.Index
		}
		for (let i = issuers.length - 1; i > -1; i--) {
			issuers[i].TargetIndex_ = index
		}
	}
	private dropTarget(issuers: Unit[]) {
		for (let i = issuers.length - 1; i > -1; i--) {
			issuers[i].TargetIndex_ = EntityManager.INVALID_INDEX
		}
	}
	private findTargetByAngle(source: Unit) {
		const targetIndex = this.heroGainAggroTargetIndex.get(source)
		if (targetIndex !== undefined) {
			return targetIndex
		}
		return (
			Units.filter(
				x =>
					x.IsAlive &&
					x !== source &&
					(x.Team !== source.Team || x.IsDeniable) &&
					x.Distance2D(source) <= source.GetAttackRange(x) &&
					source.GetAngle(x, true) < 0.2
			).orderByFirst(x => source.GetAngle(x, true))?.Index ??
			EntityManager.INVALID_INDEX
		)
	}
	private handlerErrorMessage(
		name: string,
		source: Unit,
		activity: GameActivity,
		seqVar: number
	) {
		if (!this.HasDebug) {
			return
		}
		TaskManager.Begin(() => {
			console.error(
				`Failed to get ${name}\n`,
				`ClassName: ${source.ClassName}\n`,
				`IsAlive: ${source.IsAlive}\n`,
				`Activity: ${activity}\n`,
				`SequenceVariant: ${seqVar}\n`,
				`ModelName: ${source.ModelName}\n`,
				`PlaybackRate: ${source.PlaybackRate}\n`,
				`AnimationTime: ${source.AnimationTime}\n`,
				`NetworkSequenceIndex: ${source.NetworkSequenceIndex}\n`,
				`TargetIndex: ${source.TargetIndex_}\n`,
				`TargetName: ${source.Target?.Name}\n`
			)
		})
	}
	private attackCancelled(entity: Unit, emitEvent = true) {
		this.attackLockUntil.forEach((_delay, attacker) => {
			if (!attacker.IsAttackReady) {
				return
			}
			if (attacker.Target === entity) {
				this.attackStopped(attacker, true, emitEvent)
			}
		})
	}
	private isCancelledAttack(source: Unit) {
		if (source.IsTower) {
			return false
		}
		const delay = this.attackLockUntil.get(source) ?? 0
		return delay !== 0 && delay > GameState.RawGameTime
	}
})()
