import { Entity, LocalPlayer, ParticlesSDK, Unit, Hero, WardObserver, Creep, EventsSDK, EntityManager } from "wrapper/Imports"
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
	]

State.OnValue(OnOptionToggle)
showOnAll.OnValue(OnOptionToggle)
showOnSelf.OnValue(OnOptionToggle)
showOnAllies.OnValue(OnOptionToggle)
showOnWards.OnValue(OnOptionToggle)
showOnCreeps.OnValue(OnOptionToggle)
switcher.OnValue(OnOptionToggle)

function Destroy(unit: Unit, particleID = allUnits.get(unit)!) {
	ParticlesSDK.Destroy(particleID)
	allUnits.delete(unit)
}

export function Init() {
	allUnits.clear()
}

function OnOptionToggle() {
	// loop-optimizer: KEEP
	allUnits.forEach((particle, unit) => CheckUnit(unit))
}

function IsUnitShouldBeHighlighted(unit: Unit) {
	if (unit instanceof Hero) {
		if (showOnSelf.value && unit.Owner === LocalPlayer)
			return true

		if (showOnAllies.value && unit.Owner !== LocalPlayer)
			return true
	}

	if (unit instanceof Creep && showOnCreeps.value)
		return true

	if (unit instanceof WardObserver && showOnWards.value)
		return true

	return showOnAll.value
}

export function TeamVisibilityChanged(npc: Unit) {
	CheckUnit(npc)
}

function CheckUnit(unit: Unit, isVisibleForEnemies: boolean = unit.IsVisibleForEnemies) {
	if (!State.value || unit.IsEnemy() || !unit.IsAlive || !IsUnitShouldBeHighlighted(unit)) {
		if (allUnits.has(unit))
			Destroy(unit)
		return
	}

	let particleID = allUnits.get(unit)
	if (isVisibleForEnemies && particleID === undefined)
		allUnits.set(unit, ParticlesSDK.Create(particlePath[switcher.selected_id], ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit))
	else if (!isVisibleForEnemies && particleID !== undefined)
		Destroy(unit, particleID)
}
EventsSDK.on("EntityTeamChanged", ent => {
	if (ent instanceof Unit)
		CheckUnit(ent)
	if (LocalPlayer === ent)
		EntityManager.GetEntitiesByClass(Unit).forEach(unit => CheckUnit(unit))
})

export function EntityDestroyed(ent: Entity) {
	if (!(ent instanceof Unit) || !allUnits.has(ent))
		return
	Destroy(ent)
}

export function LifeStateChanged(ent: Entity) {
	if (ent instanceof Unit)
		CheckUnit(ent)
}
