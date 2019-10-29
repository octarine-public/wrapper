import { Entity, Game, LocalPlayer, ParticlesSDK, Unit } from "wrapper/Imports"
import { showOnAll, showOnAllies, showOnCreeps, showOnSelf, showOnWards, State, switcher } from "./Menu"

let allUnits = new Map<Unit, number>(), // <Unit, Particle>
	particlePath: string[] = [
	"particles/items_fx/aura_shivas.vpcf",
	"particles/ui/ui_sweeping_ring.vpcf",
	"particles/units/heroes/hero_omniknight/omniknight_heavenly_grace_beam.vpcf",
	"particles/units/heroes/hero_spirit_breaker/spirit_breaker_haste_owner_status.vpcf",
	"particles/units/heroes/hero_spirit_breaker/spirit_breaker_haste_owner_dark.vpcf",
	"particles/units/heroes/hero_oracle/oracle_fortune_purge.vpcf",
	"particles/units/heroes/hero_spirit_breaker/spirit_breaker_haste_owner_timer.vpcf",
	"particles/econ/wards/portal/ward_portal_core/ward_portal_eye_sentry.vpcf",
]
State.OnValue(OnOptionToggle)
showOnAll.OnValue(OnOptionToggle),
showOnSelf.OnValue(OnOptionToggle)
showOnAllies.OnValue(OnOptionToggle)
showOnWards.OnValue(OnOptionToggle)
showOnCreeps.OnValue(OnOptionToggle)

function Destroy(unit: Unit, particleID: number = allUnits.get(unit)) {
	ParticlesSDK.Destroy(particleID, true)
	allUnits.delete(unit)
}

function DestroyAll() {
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach((particle, unit) => Destroy(unit, particle))
}

export function Init() {
	allUnits.clear()
}

function OnOptionToggle() {
	DestroyAll()

	if (State.value) {
		// loop-optimizer: KEEP	// because this is Map
		allUnits.forEach((particle, unit) => CheckUnit(unit))
	}
}

function IsUnitShouldBeHighlighted(unit: Unit) {
	if (unit.IsHero) {
		if (showOnSelf.value && unit.Owner === LocalPlayer)
			return true

		if (showOnAllies.value && unit.Owner !== LocalPlayer)
			return true
	}

	if (unit.IsCreep && showOnCreeps.value)
		return true

	if (unit.IsWard && showOnWards.value)
		return true

	return showOnAll.value
}

export function TrueSightedChanged(npc: Unit) {
	CheckUnit(npc)
}

function CheckUnit(unit: Unit, isVisibleForEnemies: boolean = unit.IsTrueSightedForEnemies) {
	if (!State.value || unit.IsEnemy())
		return

	let isAlive = unit.IsAlive,
		particleID = allUnits.get(unit)

	if (isVisibleForEnemies && particleID === undefined && isAlive && IsUnitShouldBeHighlighted(unit)) {
		particlePath.filter((x, i) => {
			if (switcher.selected_id === i) {
				allUnits.set(unit, ParticlesSDK.Create(x, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit))
			}
		})
	} else if ((!isVisibleForEnemies || !isAlive) && particleID !== undefined) {
		Destroy(unit, particleID)
	}
}

export function EntityDestroyed(ent: Entity) {
	if (!(ent instanceof Unit) || !allUnits.has(ent))
		return
	Destroy(ent)
}

export function LifeStateChanged(ent: Entity) {
	if (ent.IsAlive)
		return
	EntityDestroyed(ent)
}
