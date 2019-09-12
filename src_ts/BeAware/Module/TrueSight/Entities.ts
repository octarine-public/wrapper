import { Unit, Entity, ParticlesSDK, Game, Menu, LocalPlayer } from "wrapper/Imports"
import { State, showOnAll, showOnSelf, showOnAllies, showOnWards, showOnCreeps } from "./Menu"

let allUnits = new Map<Unit, number>(), // <Unit, Particle>
	particlePath = "particles/econ/wards/portal/ward_portal_core/ward_portal_eye_sentry.vpcf",
	isScriptEnabled = true;

State.OnValue(OnOptionToggle)
showOnAll.OnValue(OnOptionToggle),
showOnSelf.OnValue(OnOptionToggle)
showOnAllies.OnValue(OnOptionToggle)
showOnWards.OnValue(OnOptionToggle)
showOnCreeps.OnValue(OnOptionToggle)

function Destroy(particleID: number, unit: Unit) {
	if (particleID === -1)
		return
		
	ParticlesSDK.Destroy(particleID, true)
	allUnits.set(unit, -1)
}

function RecheckAll() {
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach((particle, unit) => {
		return CheckUnit(unit);
	});
}

function DestroyAll() {
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach(Destroy)
}

export function Tick() {
	if (Game.IsPaused)
		return false
		
	allUnits.forEach((particle, unit) => !unit.IsAlive && Destroy(particle, unit))
}

export function GameEnded() {
	// loop-optimizer: KEEP	// because this is Map
	allUnits.forEach(Destroy)
}

export function EntityCreated(x: Entity){
	if (x instanceof Unit && !x.IsEnemy())
		allUnits.set(x, -1)
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Unit)
		allUnits.delete(x)
}

function OnOptionToggle(caller: Menu.Toggle) {
	DestroyAll();

	if (isScriptEnabled) {
		RecheckAll();
	}
}

function IsUnitShouldBeHighlighted(unit: Unit) {
	if (unit.IsHero) {
		if (showOnSelf.value && unit.Owner === LocalPlayer) {
			return true;
		}

		if (showOnAllies.value && unit.Owner !== LocalPlayer) {
			return true;
		}
	}

	if (unit.IsCreep && showOnCreeps.value) {
		return true;
	}

	if (unit.IsWard && showOnWards.value) {
		return true;
	}

	return false;
}

export function TrueSightedChanged(npc: Unit, isVisibleForEnemies: boolean) {
	CheckUnit(npc, isVisibleForEnemies)
}

function CheckUnit(unit: Unit, isVisibleForEnemies: boolean = unit.IsVisibleForEnemies) {
	if (!State.value || !isScriptEnabled || unit.IsEnemy())
		return

	let isAlive = unit.IsAlive,
		particleID = allUnits.get(unit);

	if (particleID === undefined) {
		return;
	}

	if (isVisibleForEnemies && particleID === -1 && isAlive && (showOnAll.value || IsUnitShouldBeHighlighted(unit))) {
		allUnits.set(unit, ParticlesSDK.Create(particlePath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit));
	} else if ((!isVisibleForEnemies || !isAlive) && particleID !== -1) {
		Destroy(particleID, unit);
	}
}


