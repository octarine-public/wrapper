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

import { ScanGameEnded } from "./Module/Scan"

export let Units: Unit[] = []
export let Runes: Rune[] = []
export let RoshanPosition: Vector3 = new Vector3
export let OtherRadius = new Map<Entity, number>()

function BaseCreateUnits(x: Entity) {
	if (x.m_pBaseEntity instanceof C_DOTA_RoshanSpawner) {
		if (!RoshanPosition.IsZero())
			return
		RoshanPosition = x.Position
	}
}

function BaseDestroyedUnits(x: Entity) {
	if (x.m_pBaseEntity instanceof C_DOTA_RoshanSpawner) {
		if (RoshanPosition.IsZero())
			return
		RoshanPosition = new Vector3
	}
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
	ScanGameEnded()
	RuneGameEnded()
	RoshanGameEnded()
	OtherRadius.clear()
	RoshanPosition = new Vector3
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

export function ParticleUpdateEnt(id: number, entity: Entity, vector: Vector3) {
	RuneParticleCreateUpdateEnt(id, entity, vector)
}

export function ParticleCreated(id: number, entity: Entity | number | undefined, handle: bigint) {
	RoshanParticleCreate(handle)
	RuneParticleCreate(id, entity, handle)
}
