import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { EventPriority } from "../../Enums/EventPriority"
import { GameActivity } from "../../Enums/GameActivity"
import { GameSleeper } from "../../Helpers/Sleeper"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { Entity } from "../../Objects/Base/Entity"
import { Unit, Units } from "../../Objects/Base/Unit"
import { Tower } from "../../Objects/Buildings/Tower"
import { GameState } from "../../Utils/GameState"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"
import { TaskManager } from "../TaskManager"

const Monitor = new (class CUnitAttackChanged {
	protected get HasDebug(): boolean {
		return (globalThis as any)?.DEBUGGER_INSTALLED ?? false
	}

	private readonly attackActivities = [
		GameActivity.ACT_DOTA_ATTACK,
		GameActivity.ACT_DOTA_ATTACK2,
		GameActivity.ACT_DOTA_ATTACK_EVENT
	]

	private readonly attackSleeper = new GameSleeper()
	private readonly heroGainAggroTargetIndex = new Map<Unit, number>()

	public GameEnded() {
		this.attackSleeper.FullReset()
	}

	public LifeStateChanged(entity: Entity) {
		if (entity instanceof Unit) {
			this.attackStopped(entity)
			this.heroGainAggroTargetIndex.delete(entity)
		}
	}

	public EntityDestroyed(entity: Entity) {
		if (entity instanceof Unit) {
			this.attackStopped(entity)
			this.heroGainAggroTargetIndex.delete(entity)
		}
	}

	public NetworkActivityChanged(source: Unit) {
		if (!this.attackActivities.includes(source.NetworkActivity)) {
			this.attackStopped(source)
		}
	}

	public PrepareUnitOrders(order: ExecuteOrder) {
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

	public UnitAnimation(
		source: Unit,
		seqVar?: number,
		activity?: GameActivity,
		attackPoint = 0
	) {
		if (
			seqVar === undefined ||
			activity === undefined ||
			!this.attackActivities.includes(activity)
		) {
			this.attackStopped(source)
			return
		}
		const animation = source.GetAnimation(activity, seqVar, false)
		if (animation === undefined) {
			this.handlerErrorMessage("animation AnimationsData", source, activity, seqVar)
			this.attackStopped(source, true)
			return
		}
		this.attackStarted(
			source,
			attackPoint,
			animation.activities.map(activityData => activityData.name)
		)
	}

	public GameEvent(name: string, obj: any) {
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

	private attackStarted(source: Unit, attackPoint: number, animationNames: string[]) {
		if (!source.IsAlive) {
			return
		}
		if (!source.IsControllable && !source.IsTower) {
			source.TargetIndex_ = this.findTarget(source)
		}
		if (source instanceof Tower) {
			source.TargetIndex_ = source.TowerAttackTarget_
		} else {
			source.IsAttacking = true
		}
		if (
			source.IsControllable &&
			source.TargetIndex_ === EntityManager.INVALID_HANDLE
		) {
			source.TargetIndex_ = this.findTarget(source)
		}
		if (this.attackSleeper.Sleeping(source.Index)) {
			EventsSDK.emit("AttackEnded", false, source)
			this.attackSleeper.ResetKey(source.Index)
		}
		const delay =
			Math.ceil(attackPoint / GameState.TickInterval) * GameState.TickInterval
		this.attackSleeper.Sleep(delay * 1000, source.Index)
		EventsSDK.emit("AttackStarted", false, source, attackPoint, animationNames)
		this.handlerErrorMessageAttack(source, attackPoint)
	}

	private attackStopped(source: Unit, stoppedByError = false) {
		if (!this.attackSleeper.Sleeping(source.Index) && !stoppedByError) {
			return
		}
		source.IsAttacking = false
		source.TargetIndex_ = EntityManager.INVALID_HANDLE
		this.attackSleeper.ResetKey(source.Index)
		this.heroGainAggroTargetIndex.delete(source)
		EventsSDK.emit("AttackEnded", false, source)
	}

	private setTarget(issuers: Unit[], entity: Nullable<number | Entity>) {
		let index = EntityManager.INVALID_HANDLE
		if (entity instanceof Entity || typeof entity === "number") {
			index = typeof entity === "number" ? entity : entity.Index
		}
		for (let i = issuers.length - 1; i > -1; i--) {
			const source = issuers[i]
			source.TargetIndex_ = index
			source.IsAttacking = true
		}
	}

	private dropTarget(issuers: Unit[]) {
		for (let i = issuers.length - 1; i > -1; i--) {
			const source = issuers[i]
			source.IsAttacking = false
			source.TargetIndex_ = EntityManager.INVALID_HANDLE
		}
	}

	private findTarget(source: Unit) {
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
					x.Distance2D(source) <= source.GetAttackRange(x, 25) &&
					source.GetAngle(x, true) < 1.5
			).orderByFirst(x => source.GetAngle(x, true))?.Index ??
			EntityManager.INVALID_HANDLE
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

	private handlerErrorMessageAttack(unit: Unit, rawCastPoint: number) {
		if (!this.HasDebug) {
			return
		}
		const debug = false
		if (!debug) {
			return
		}
		TaskManager.Begin(() => {
			const digits = 1e4,
				epsilon = 1e-4,
				currValue = Math.ceil(unit.AttackPoint * digits) / digits,
				networkedValue = Math.ceil(rawCastPoint * digits) / digits

			if (Math.abs(currValue - networkedValue) > epsilon) {
				console.error(
					"Error: networked attack point doesn't match current attack point\n",
					`Has EchoSabre: ${unit.HasBuffByName("modifier_item_echo_sabre")}\n`,
					`Name: ${unit.Name}\n`,
					`ClassName: ${unit.ClassName}\n`,
					`AttackSpeed ${unit.AttackSpeed}\n`,
					`AttackPoint ${currValue}\n`,
					`UnitAnimation#CastPoint ${networkedValue}\n`
				)
			}
		})
	}
})()

EventsSDK.on("GameEnded", () => Monitor.GameEnded(), EventPriority.IMMEDIATE)

EventsSDK.on("EntityDestroyed", entity => Monitor.EntityDestroyed(entity))

EventsSDK.on(
	"GameEvent",
	(name, obj) => Monitor.GameEvent(name, obj),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"PrepareUnitOrders",
	order => Monitor.PrepareUnitOrders(order),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"UnitAnimationEnd",
	(unit, _) => Monitor.UnitAnimation(unit),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"NetworkActivityChanged",
	unit => Monitor.NetworkActivityChanged(unit),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"LifeStateChanged",
	entity => Monitor.LifeStateChanged(entity),
	EventPriority.IMMEDIATE
)

EventsSDK.on(
	"UnitAnimation",
	(
		source,
		seqVar,
		_playbackrate,
		_castPoint,
		_type,
		activity,
		_lagCompensationTime,
		rawCastPoint
	) => Monitor.UnitAnimation(source, seqVar, activity, rawCastPoint),
	EventPriority.IMMEDIATE
)
