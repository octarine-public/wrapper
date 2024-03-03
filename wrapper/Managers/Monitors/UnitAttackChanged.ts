import { dotaunitorder_t } from "../../Enums/dotaunitorder_t"
import { GameActivity } from "../../Enums/GameActivity"
import { GameSleeper } from "../../Helpers/Sleeper"
import { ExecuteOrder } from "../../Native/ExecuteOrder"
import { Entity } from "../../Objects/Base/Entity"
import { Unit, Units } from "../../Objects/Base/Unit"
import { Tower } from "../../Objects/Buildings/Tower"
import { EntityManager } from "../EntityManager"
import { EventsSDK } from "../EventsSDK"

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
	private readonly targetIndices = new Map<Unit, number>()

	public GameEnded() {
		this.attackSleeper.FullReset()
	}

	public LifeStateChanged(entity: Entity) {
		if (entity instanceof Unit) {
			this.attackStopped(entity)
			this.targetIndices.delete(entity)
		}
	}

	public EntityDestroyed(entity: Entity) {
		if (entity instanceof Unit) {
			this.attackStopped(entity)
			this.targetIndices.delete(entity)
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
		castPoint = 0
	) {
		if (
			seqVar === undefined ||
			activity === undefined ||
			!this.attackActivities.includes(activity)
		) {
			this.attackStopped(source)
			return
		}
		const animationID = source.GetAnimationID(activity, seqVar)
		if (animationID === undefined) {
			this.attackStopped(source)
			this.handlerErrorMessage("Failed to get animation ID")
			return
		}
		const animation = source.Animations[animationID]
		if (animation === undefined) {
			this.attackStopped(source)
			this.handlerErrorMessage("Failed to get animation data")
			return
		}
		const animationNames = animation.activities.map(activityData => activityData.name)
		this.attackStarted(source, castPoint, animationNames)
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
			this.targetIndices.set(attacker, obj.entindex_hero)
		}
	}

	private attackStarted(source: Unit, castPoint: number, animationNames: string[]) {
		if (!source.IsAlive) {
			return
		}

		if (!source.IsControllable && !source.IsTower) {
			source.TargetIndex_ = this.findTarget(source)
		}

		if (source instanceof Tower) {
			source.TargetIndex_ = source.TowerAttackTarget_
		}

		source.IsAttacking = true

		if (source.IsControllable && source.TargetIndex_ === -1) {
			source.TargetIndex_ = this.findTarget(source)
		}

		if (this.attackSleeper.Sleeping(source.Index)) {
			EventsSDK.emit("AttackEnded", false, source)
			this.attackSleeper.ResetKey(source.Index)
		}

		const delay = Math.ceil(castPoint * 30) / 30
		this.attackSleeper.Sleep(delay * 1000, source.Index)
		EventsSDK.emit("AttackStarted", false, source, castPoint, animationNames)
	}

	private attackStopped(source: Unit) {
		if (!this.attackSleeper.Sleeping(source.Index)) {
			return
		}
		source.TargetIndex_ = -1
		source.IsAttacking = false
		this.targetIndices.delete(source)
		this.attackSleeper.ResetKey(source.Index)
		EventsSDK.emit("AttackEnded", false, source)
	}

	private setTarget(issuers: Unit[], entity: Nullable<number | Entity>) {
		const index = (entity instanceof Entity ? entity.Index : entity) ?? -1
		for (const source of issuers) {
			source.TargetIndex_ = index
			source.IsAttacking = true
		}
	}

	private dropTarget(issuers: Unit[]) {
		for (const issuer of issuers) {
			issuer.IsAttacking = false
			issuer.TargetIndex_ = -1
		}
	}

	private findTarget(source: Unit) {
		const targetIndex = this.targetIndices.get(source)
		if (targetIndex !== undefined) {
			return targetIndex
		}

		const newUnits = Units.filter(
			x =>
				x.IsAlive &&
				x !== source &&
				x.Team !== source.Team &&
				x.Distance2D(source) <= source.GetAttackRange(x, 25)
		).orderBy(x => source.GetAngle(x))

		return newUnits.find(x => source.GetAngle(x) < 0.35)?.Index ?? -1
	}

	private handlerErrorMessage(...args: any[]) {
		if (this.HasDebug) {
			console.error(...args)
		}
	}
})()

EventsSDK.on(
	"PrepareUnitOrders",
	order => Monitor.PrepareUnitOrders(order),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"UnitAnimationEnd",
	(unit, _) => Monitor.UnitAnimation(unit),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"UnitAnimation",
	(source, seqVar, _playbackrate, castPoint, _type, activity, _lagCompensationTime) =>
		Monitor.UnitAnimation(source, seqVar, activity, castPoint),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"NetworkActivityChanged",
	unit => Monitor.NetworkActivityChanged(unit),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"GameEvent",
	(name, obj) => Monitor.GameEvent(name, obj),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on(
	"LifeStateChanged",
	entity => Monitor.LifeStateChanged(entity),
	Number.MIN_SAFE_INTEGER
)

EventsSDK.on("GameEnded", () => Monitor.GameEnded(), Number.MIN_SAFE_INTEGER)

EventsSDK.on("EntityDestroyed", entity => Monitor.EntityDestroyed(entity))
