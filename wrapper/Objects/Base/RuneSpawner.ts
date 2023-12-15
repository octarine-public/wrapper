import { Runes } from "../../Data/GameData"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { Entity, GameRules } from "./Entity"

export class RuneSpawner extends Entity {
	/** @readonly */
	public LastSpawnTime = 0 // game time (seconds)
	/** @readonly */
	public NextSpawnTime = 0 // game time (seconds)

	public get ModuleTime() {
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
				return GameRules.GameTime + this.MaxDuration("seconds")
		}
	}
	/**
	 * Get the appearance time of a rune.
	 * @description The appearance time in the specified format.
	 * @param timeType - The type of time to return ("seconds" or "minutes"). Default is "minutes".
	 * @returns {number}
	 */
	public MaxDuration(timeType: "seconds" | "minutes" = "minutes"): number {
		// Get the last spawn time and next spawn time
		const lastSpawnTime = this.LastSpawnTime - 1 / 20
		const nextSpawnTime = this.NextSpawnTime

		console.log(Runes.BountySpawnEverySeconds)
		// Calculate the time format based on the given time type
		const timeFormat = timeType === "seconds" ? 1 : 60
		// Calculate the appearance time based on the last spawn time and next spawn time
		return Math.max(nextSpawnTime - lastSpawnTime / timeFormat, 0)
	}
}
