import {
	ArrayExtensions,
	Entity,
	Unit,
	Vector3,
} from "wrapper/Imports"

import {
	RoshanGameEnded,
	RoshanParticleCreate,
	RoshanTick,
	RoshanGameEvent,
} from "./Module/Roshan";

import { State } from "./Menu";

import {
	EntityCreatedRune,
	EntityDestroyedRune,
	RuneGameEnded,
	RuneParticleCreate,
	RuneParticleCreateUpdateEnt,
	RuneParticleDestroyed,
} from "./Module/Runes"

import { ScanGameEnded } from "./Module/Scan";

export let Units: Unit[] = []
export let RoshanPosition: Vector3 = new Vector3
export let OtherRadius = new Map<Entity, number>()

function BaseCreateUnits(x: Entity) {
	if (x instanceof Unit && !x.IsHero)
		Units.push(x)
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
	if (x instanceof Unit)
		ArrayExtensions.arrayRemove(Units, x)
}

export function Tick() {
	if (!State.value)
		return
	RoshanTick()
}

export function Init() {
	Units = []
	OtherRadius.clear()
	ScanGameEnded()
	RuneGameEnded()
	RoshanGameEnded()
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

export function ParticleCreated(id: number, entity: Entity, path: string, handle: bigint) {
	RoshanParticleCreate(handle, entity)
	RuneParticleCreate(id, entity, handle)
}
