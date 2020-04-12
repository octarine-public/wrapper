import {
	Entity,
	Vector3,
	Building,
	EntityManager,
	Unit,
	Creep,
	Rune,
	Hero,
} from "wrapper/Imports"

import {
	RoshanGameEnded,
	RoshanParticleCreate,
	RoshanTick,
	RoshanGameEvent,
} from "./Module/Roshan"

import { State } from "./Menu"

import {
	EntityCreatedRune,
	EntityDestroyedRune,
	RuneGameEnded,
	RuneParticleCreate,
	RuneParticleCreateUpdateEnt,
	RuneParticleDestroyed,
} from "./Module/Runes"

export let Units: Unit[] = []
export let Runes: Rune[] = []
export let OtherRadius = new Map<Entity, number>()

let RoshanSpawner: Nullable<Entity>
export function GetRoshanPosition(): Vector3 {
	return RoshanSpawner?.Position ?? new Vector3()
}

function BaseCreateUnits(x: Entity) {
	if (x.ClassName === "CDOTA_RoshanSpawner")
		RoshanSpawner = x
}

function BaseDestroyedUnits(x: Entity) {
	if (x.ClassName === "CDOTA_RoshanSpawner")
		RoshanSpawner = undefined
}
export function Tick() {
	if (!State.value)
		return
	RoshanTick()
	Runes = EntityManager.GetEntitiesByClass(Rune).filter(x => x.IsValid && x.IsAlive)
	Units = EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep, Building]).filter(x => x.IsValid && x.IsAlive)
}

export function Init() {
	Units = []
	Runes = []
	RuneGameEnded()
	RoshanGameEnded()
	OtherRadius.clear()
	RoshanSpawner = undefined
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

export function GameEvent(name: string, obj: any) {
	RoshanGameEvent(name, obj)
}

export function ParticleUpdateEnt(id: number, entity: Nullable<Entity>, vector: Vector3) {
	RuneParticleCreateUpdateEnt(id, entity, vector)
}

export function ParticleCreated(id: number, entity: Nullable<Entity>, handle: bigint) {
	RoshanParticleCreate(handle)
	RuneParticleCreate(id, entity, handle)
}
