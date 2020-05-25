import { Entity, LocalPlayer, ParticlesSDK, Unit, WardObserver, Creep, Hero, EventsSDK, EntityManager, Particle } from "wrapper/Imports"
import { showOnAll, showOnAllies, showOnCreeps, showOnSelf, showOnWards, State, switcher, stateMain } from "./Menu"

let particleManager = new ParticlesSDK()

const allUnits = new Map<Unit, Particle>() // <Unit, Particle>
const particlePath: string[] = [
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
stateMain.OnValue(OnOptionToggle)
showOnAll.OnValue(OnOptionToggle)
showOnSelf.OnValue(OnOptionToggle)
showOnAllies.OnValue(OnOptionToggle)
showOnWards.OnValue(OnOptionToggle)
showOnCreeps.OnValue(OnOptionToggle)

function Destroy(unit: Unit) {
	particleManager.DestroyByKey(unit)
	allUnits.delete(unit)
}

export function Init() {
	allUnits.clear()
}

function OnOptionToggle() {
	allUnits.forEach((_, unit) => CheckUnit(unit))
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

export function TrueSightedChanged(npc: Unit) {
	CheckUnit(npc)
}

function CheckUnit(unit: Unit, isVisibleForEnemies: boolean = unit.IsTrueSightedForEnemies) {
	if (!stateMain.value || !State.value || unit.IsEnemy() || !unit.IsAlive || !IsUnitShouldBeHighlighted(unit)) {
		if (allUnits.has(unit))
			Destroy(unit)
		return
	}

	let particleID = allUnits.get(unit)
	if (isVisibleForEnemies && particleID === undefined) {
		let par = particleManager.AddOrUpdate(unit,
			particlePath[switcher.selected_id],
			ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
			unit
		)
		allUnits.set(unit, par.Key)
	} else if (!isVisibleForEnemies && particleID !== undefined)
		Destroy(unit)
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
