import { 
	Hero, 
	Unit, 
	Entity, 
	Creep, 
	ArrayExtensions, 
	Vector3
} from "wrapper/Imports"

import {
	RoshanTick,
	RoshanGameEnded,
	RoshanParticleCreate,
	RoshanUnitAnimationCreate 
} from "./Module/Roshan";

import { State } from "./Menu";
import { ScanGameEnded } from "./Module/Scan";
import { 
	RuneGameEnded,
	EntityCreatedRune, 
	EntityDestroyedRune, 
	RuneParticleCreate, 
	RuneParticleCreateUpdateEnt,
	RuneParticleDestroyed,
} from "./Module/Runes";

export let Units: Unit[] = []
export let Owner: Hero
export let OtherRadius = new Map<Entity, number>()

function BaseGameStarted(x: Hero) {
	if (Owner === undefined) {
		Owner = x
	}
}
function BaseCreateUnits(x: Entity) {
	if (x instanceof Unit && !x.IsHero) {
		Units.push(x)
	}
}
function BaseDestroyedUnits(x: Entity) {
	if (x instanceof Entity && x instanceof Creep && x.IsLaneCreep && !x.IsHero) {
		if (Units !== undefined || Units.length > 0) {
			ArrayExtensions.arrayRemove(Units, x)
		}
	}
}

export function Tick() {
	if (!State.value) {
		return false
	}
	RoshanTick()
}

export function GameEnded() {
	Units = []
	OtherRadius.clear()
	Owner = undefined
	ScanGameEnded()
	RuneGameEnded()
	RoshanGameEnded()
}

export function GameStarted(x: Hero) {
	BaseGameStarted(x)
}

export function EntityCreated(x: Entity) {
	BaseCreateUnits(x)
	EntityCreatedRune(x)
}

export function EntityDestroyed(x: Entity) {
	BaseDestroyedUnits(x)
	EntityDestroyedRune(x)
}

export function ParticleDestroyed(id: number) {
	RuneParticleDestroyed(id)
}

export function UnitAnimationCreate(unit: Unit) {
	if (!State.value) {
		return false
	}
	RoshanUnitAnimationCreate(unit)
}

export function ParticleUpdateEnt(id: number, entity: Entity, vector: Vector3) {
	RuneParticleCreateUpdateEnt(id, entity, vector)
}

export function ParticleCreated(id: number, entity: Entity, path: string, handle: bigint) {
	RoshanParticleCreate(handle)
	RuneParticleCreate(id, entity, handle)
}



