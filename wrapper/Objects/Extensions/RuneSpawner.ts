import { Entity } from "../Base/Entity"

export class RuneSpawner extends Entity {
	/** @readonly */
	public LastSpawnTime = 0 // game time (seconds)
	/** @readonly */
	public NextSpawnTime = 0 // game time (seconds)
	/**
	 * Get the appearance time of a rune.
	 * @description The appearance time in the specified format.
	 * @param timeType - The type of time to return ("seconds" or "minutes"). Default is "minutes".
	 * @returns {number}
	 */
	public RuneSpawnTime(timeType: "seconds" | "minutes" = "minutes"): number {
		// Get the last spawn time and next spawn time
		const lastSpawnTime = this.LastSpawnTime
		const nextSpawnTime = this.NextSpawnTime
		// Calculate the time format based on the given time type
		const timeFormat = timeType === "seconds" ? 1 : 60
		// Calculate the appearance time based on the last spawn time and next spawn time
		return Math.max((lastSpawnTime - nextSpawnTime) / timeFormat, 0)
	}
}
