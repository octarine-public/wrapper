import { Color } from "../../Base/Color"
import { WrapperClass } from "../../Decorators"
import { ETormentorLocation } from "../../Enums/ETormentorLocation"
import { ETormentorSpawnPhase } from "../../Enums/ETormentorSpawnPhase"
import { RenderMode } from "../../Enums/RenderMode"
import { EntityManager } from "../../Managers/EntityManager"
import { Entity, GameRules } from "./Entity"

@WrapperClass("CDOTA_MinibossSpawner")
export class MinibossSpawner extends Entity {
	public TOPSpawner_: number = EntityManager.INVALID_HANDLE
	public BOTSpawner_: number = EntityManager.INVALID_HANDLE

	public get TOPLocation() {
		return (
			EntityManager.EntityByIndex<Entity>(this.TOPSpawner_)?.Position ??
			super.Position
		)
	}
	public get BOTLocation() {
		return (
			EntityManager.EntityByIndex<Entity>(this.BOTSpawner_)?.Position ??
			super.Position
		)
	}
	public set CustomGlowColor(_: Nullable<Color>) {
		// N/A for non-networked entities
	}
	public set CustomDrawColor(_: Nullable<[Color, RenderMode]>) {
		// N/A for non-networked entities
	}
	public get IsAlive() {
		return super.IsAlive || this.IsAliveTormentor
	}
	public get LocationType() {
		return GameRules?.TormentorLocation ?? ETormentorLocation.TORMENTOR_LOCATION_TOP
	}
	public get IsAliveTormentor() {
		return (
			(GameRules?.TormentorSpawnPhase ??
				ETormentorSpawnPhase.TORMENTOR_SPAWN_PHASE_HAS_NOT_SPAWNED) ===
			ETormentorSpawnPhase.TORMENTOR_SPAWN_PHASE_ALIVE
		)
	}
	public get Position() {
		switch (this.LocationType) {
			case ETormentorLocation.TORMENTOR_LOCATION_TOP:
				return this.TOPLocation
			default:
				return this.BOTLocation
		}
	}
}
