import { DOTAGameState } from "../../Enums/DOTAGameState"
import { GameState } from "../../Utils/GameState"
import { Entity, GameRules } from "./Entity"

export class RuneSpawner extends Entity {
	/** @readonly */
	public LastSpawnTime: number = -1 // game time (seconds)
	/** @readonly */
	public NextSpawnTime: number = -1 // game time (seconds)

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
}
