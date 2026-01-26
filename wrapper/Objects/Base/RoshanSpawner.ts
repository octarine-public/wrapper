import { Color } from "../../Base/Color"
import { Vector3 } from "../../Base/Vector3"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { ERoshanLocation } from "../../Enums/ERoshanLocation"
import { RenderMode } from "../../Enums/RenderMode"
import { Team } from "../../Enums/Team"
import { EntityManager } from "../../Managers/EntityManager"
import { ConVarsSDK } from "../../Native/ConVarsSDK"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules } from "./Entity"
import { Unit } from "./Unit"

@WrapperClass("CDOTA_RoshanSpawner")
export class RoshanSpawner extends Entity {
	private static readonly everyTimeAfterInitial = 5 * 60

	public static get InitialTime() {
		return ConVarsSDK.GetFloat("dota_roshan_initial_move_timer", 899)
	}
	public static get TimeUntilNextMove() {
		return GameState.RawGameTime < RoshanSpawner.InitialTime
			? RoshanSpawner.InitialTime - this.currentCycleTime
			: this.everyTimeAfterInitial - this.currentCycleTime
	}
	private static get currentCycleTime() {
		const initial = RoshanSpawner.InitialTime,
			rawTime = GameState.RawGameTime,
			gameTime = Math.abs(GameRules?.GameTime ?? 0)
		return gameTime % (rawTime < initial ? initial : this.everyTimeAfterInitial)
	}
	public IsMovingRoshan = false
	public readonly RoshanPrediction = new Vector3()
	@NetworkedBasicField("m_iKillCount")
	public readonly KillCount = 0
	@NetworkedBasicField("m_iLastKillerTeam")
	public readonly LastKillerTeam: Team = Team.None
	public TOPSpawner_: number = EntityManager.INVALID_HANDLE
	public BOTSpawner_: number = EntityManager.INVALID_HANDLE
	@NetworkedBasicField("m_hRoshan")
	public readonly RoshanHandle: number = EntityManager.INVALID_HANDLE

	public get Roshan() {
		return EntityManager.EntityByIndex<Unit>(this.RoshanHandle)
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
		return !(GameRules?.IsNightGameTime ?? false) ||
			GameState.RawGameTime <= RoshanSpawner.InitialTime + GameState.TickInterval
			? ERoshanLocation.BOT
			: ERoshanLocation.TOP
	}
	public get Position() {
		if (this.IsMovingRoshan) {
			return this.RoshanPrediction
		}
		switch (this.LocationType) {
			case ERoshanLocation.TOP:
				return this.TOPLocation
			default:
				return this.BOTLocation
		}
	}
}
