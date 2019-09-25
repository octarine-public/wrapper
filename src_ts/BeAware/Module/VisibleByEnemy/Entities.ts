import { Entity, Game, LocalPlayer, ParticlesSDK, Unit } from "wrapper/Imports"
import { showOnAll, showOnAllies, showOnCreeps, showOnSelf, showOnWards, State } from "./Menu"

let allUnits = new Map<Unit, number>(), // <Unit, Particle>
	particlePath = "particles/items_fx/aura_shivas.vpcf"

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

export function GameEnded() {
	DestroyAll()
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

export function TeamVisibilityChanged(npc: Unit) {
	CheckUnit(npc)
}

function CheckUnit(unit: Unit, isVisibleForEnemies: boolean = unit.IsVisibleForEnemies) {
	if (!State.value || unit.IsEnemy())
		return

	let isAlive = unit.IsAlive,
		particleID = allUnits.get(unit)

	if (isVisibleForEnemies && particleID === undefined && isAlive && IsUnitShouldBeHighlighted(unit)) {
		allUnits.set(unit, ParticlesSDK.Create(particlePath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit))
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
