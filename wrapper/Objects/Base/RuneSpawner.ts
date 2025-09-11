import { Matrix3x4 } from "../../Base/Matrix3x4"
import { Vector3 } from "../../Base/Vector3"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { ERuneSpawnerLocation } from "../../Enums/ERuneSpawnerLocation"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules } from "./Entity"

export class RuneSpawner extends Entity {
	public static readonly Locations: [Vector3, ERuneSpawnerLocation][] = [
		[new Vector3(-996, -4431, 176), ERuneSpawnerLocation.TOP], // bounty
		[new Vector3(-1640, 1112, 48), ERuneSpawnerLocation.TOP], // powerup
		[new Vector3(1180, -1216, 64), ERuneSpawnerLocation.BOT], // powerup
		[new Vector3(595, -4660, 176), ERuneSpawnerLocation.BOT] // bounty
	]
	/** @readonly */
	public LastSpawnTime: number = -1 // game time (seconds)
	/** @readonly */
	public NextSpawnTime: number = -1 // game time (seconds)
	/** @readonly */
	public readonly Type: RuneSpawnerType = RuneSpawnerType.Invalid
	/** @readonly */
	public Location: ERuneSpawnerLocation = ERuneSpawnerLocation.Invalid

	public get ModuleTime(): number {
		return this.GameTime % this.MaxDuration("seconds")
	}
	public get Remaining() {
		return this.MaxDuration("seconds") - this.ModuleTime
	}
	protected get GameTime() {
		if (GameRules === undefined) {
			return 0
		}
		const gameTime = GameRules.GameTime
		switch (GameRules.GameState) {
			case DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
				return gameTime
			default:
				return gameTime + this.MaxDuration("seconds")
		}
	}
	protected get SpawnsTime(): [number, number] {
		// Get the last spawn time and next spawn time
		return [0, 0] // [lastSpawnTime, nextSpawnTime]
	}
	public MaxDuration(timeType: "seconds" | "minutes" = "minutes"): number {
		// Get the last spawn time and next spawn time
		const [lastSpawnTime, nextSpawnTime] = this.SpawnsTime
		// Calculate the time format based on the given time type
		const timeFormat = timeType === "seconds" ? 1 : 60
		// Calculate the appearance time based on the last spawn time and next spawn time
		return Math.max(nextSpawnTime - lastSpawnTime / timeFormat, 0)
	}
	// used in SpawnsTime (don't use MaxDuration this in the function)
	protected CalculateNextSpawnTime(spawnTimeSec: number): number {
		const rawGameTime = GameState.RawGameTime
		if (GameRules === undefined) {
			return rawGameTime
		}
		const gameTime = GameRules.GameTime
		return gameTime >= 0 ? gameTime + spawnTimeSec : rawGameTime
	}
	public UpdatePositions(parentTransform?: Matrix3x4) {
		super.UpdatePositions(parentTransform)
		this.UpdatePositionByEntityCreated()
	}
	public UpdatePositionByEntityCreated() {
		const location = RuneSpawner.Locations.find(
			([pos]) =>
				pos.Equals(this.NetworkedPosition) ||
				pos.Distance2D(this.NetworkedPosition) < 10
		)
		if (location !== undefined) {
			this.Location = location[1]
		}
	}
}
