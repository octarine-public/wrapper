import { NetworkedParticle } from "../../../Base/NetworkedParticle"
import { WrapperClass } from "../../../Decorators"
import { EventPriority } from "../../../Enums/EventPriority"
import { EntityManager } from "../../../Managers/EntityManager"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { GameState } from "../../../Utils/GameState"
import { Ability } from "../../Base/Ability"
import { Entity } from "../../Base/Entity"
import { Modifier } from "../../Base/Modifier"
import { TrackingProjectile } from "../../Base/Projectile"

@WrapperClass("spirit_breaker_charge_of_darkness")
export class spirit_breaker_charge_of_darkness extends Ability {
	public StartedChargingTime = 0
	public ChargeTargetIndex: number = EntityManager.INVALID_INDEX
	public CurrentProjectile: Nullable<TrackingProjectile>
	public readonly InteranlTargets = new Set<number>()

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("bash_radius", level)
	}
}

const abils = EntityManager.GetEntitiesByClass(spirit_breaker_charge_of_darkness)
function UpdateTarget(mod: Modifier, destroy = false) {
	if (mod.Name !== "modifier_spirit_breaker_charge_of_darkness_vision") {
		return
	}
	const target = mod.Parent,
		abil = mod.Ability
	if (target === undefined || !(abil instanceof spirit_breaker_charge_of_darkness)) {
		return
	}
	if (!destroy) {
		abil.InteranlTargets.add(target.Index)
		abil.ChargeTargetIndex = target.Index
		return
	}
	if (abil.InteranlTargets.size > 1 && abil.InteranlTargets.has(target.Index)) {
		abil.InteranlTargets.delete(target.Index)
		return
	}
	abil.StartedChargingTime = 0
	abil.CurrentProjectile = undefined
	abil.ChargeTargetIndex = EntityManager.INVALID_INDEX
	abil.InteranlTargets.clear()
}

function ParticleCreated(par: NetworkedParticle) {
	if (par.Ability instanceof spirit_breaker_charge_of_darkness) {
		par.Ability.StartedChargingTime = GameState.RawGameTime
	}
}

function TrackingProjectileCreated(proj: TrackingProjectile) {
	if (proj.ParticlePath !== undefined || proj.Source !== undefined) {
		return
	}
	for (let i = abils.length - 1; i > -1; i--) {
		const abil = abils[i]
		if (
			abil.StartedChargingTime === GameState.RawGameTime &&
			abil.CurrentProjectile === undefined
		) {
			abil.CurrentProjectile = proj
			break
		}
	}
}

function TrackingProjectileDestroyed(proj: TrackingProjectile) {
	for (let i = abils.length - 1; i > -1; i--) {
		const abil = abils[i]
		if (abil.CurrentProjectile === proj) {
			abil.CurrentProjectile = undefined
			break
		}
	}
}

function EntityDestroyed(entity: Entity) {
	if (entity instanceof spirit_breaker_charge_of_darkness) {
		entity.StartedChargingTime = 0
		entity.CurrentProjectile = undefined
		entity.ChargeTargetIndex = EntityManager.INVALID_INDEX
		entity.InteranlTargets.clear()
	}
}

EventsSDK.on("ParticleCreated", par => ParticleCreated(par), EventPriority.HIGH)

EventsSDK.on("ModifierCreated", mod => UpdateTarget(mod), EventPriority.HIGH)

EventsSDK.on("ModifierChanged", mod => UpdateTarget(mod), EventPriority.HIGH)

EventsSDK.on("ModifierRemoved", mod => UpdateTarget(mod, true), EventPriority.HIGH)

EventsSDK.on("EntityDestroyed", entity => EntityDestroyed(entity), EventPriority.HIGH)

EventsSDK.on(
	"TrackingProjectileCreated",
	proj => TrackingProjectileCreated(proj),
	EventPriority.HIGH
)

EventsSDK.on(
	"TrackingProjectileDestroyed",
	proj => TrackingProjectileDestroyed(proj),
	EventPriority.HIGH
)
