import { Color } from "../../Base/Color"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { ERoshanLocation } from "../../Enums/ERoshanLocation"
import { RenderMode } from "../../Enums/RenderMode"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_RoshanSpawner")
export class RoshanSpawner extends Entity {
	@NetworkedBasicField("m_iKillCount")
	public readonly KillCount = 0
	@NetworkedBasicField("m_iLastKillerTeam")
	public readonly LastKillerTeam: Team = Team.None
	public TOPSpawner_: number = EntityManager.INVALID_HANDLE
	public BOTSpawner_: number = EntityManager.INVALID_HANDLE
	@NetworkedBasicField("m_hRoshan")
	private readonly roshan_: number = EntityManager.INVALID_HANDLE

	public get Roshan() {
		return EntityManager.EntityByIndex<Unit>(this.roshan_)
	}
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
	public get LocationType() {
		return !(GameRules?.IsNightGameTime ?? false) || GameState.RawGameTime < 15 * 60
			? ERoshanLocation.BOT
			: ERoshanLocation.TOP
	}
	public get Position() {
		switch (this.LocationType) {
			case ERoshanLocation.TOP:
				return this.TOPLocation
			default:
				return this.BOTLocation
		}
	}
}
