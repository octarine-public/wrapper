import { Runes } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RegisterFieldHandler } from "../NativeToSDK"
import { GameRules } from "./Entity"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_Powerup")
export class RuneSpawnerPowerup extends RuneSpawner {
	@NetworkedBasicField("m_bNextRuneIsWater")
	public readonly NextRuneIsWater = false
	@NetworkedBasicField("m_bWillSpawnNextPowerRune")
	public readonly WillSpawnNextPowerRune = false
	public readonly Type = RuneSpawnerType.Powerup

	protected get SpawnsTime(): [number, number] {
		if (GameRules === undefined) {
			return [0, 0]
		}
		// If the last spawn time is not set or -1000, set it to the current game time
		let lastSpawnTime = this.LastSpawnTime
		let nextSpawnTime = this.NextSpawnTime
		if (lastSpawnTime < 0) {
			lastSpawnTime = this.CreateTime
		}
		if (nextSpawnTime < 0) {
			nextSpawnTime = GameRules.GameTime + Runes.PowerUpSpawnEverySeconds
		}
		return [lastSpawnTime, nextSpawnTime]
	}
}

function UpdateGameData(ent: RuneSpawnerPowerup) {
	Runes.PowerUpSpawnEveryMinutes = ent.MaxDuration()
	Runes.PowerUpSpawnEverySeconds = ent.MaxDuration("seconds")
}
RegisterFieldHandler(RuneSpawnerPowerup, "m_flLastSpawnTime", (ent, newVal) => {
	const oldValue = ent.LastSpawnTime,
		newValue = newVal as number
	if (oldValue !== newValue) {
		ent.LastSpawnTime = newValue
		UpdateGameData(ent)
	}
})
RegisterFieldHandler(RuneSpawnerPowerup, "m_flNextSpawnTime", (ent, newVal) => {
	const oldValue = ent.NextSpawnTime,
		newValue = newVal as number
	if (oldValue !== newValue) {
		ent.NextSpawnTime = newValue
		UpdateGameData(ent)
	}
})
