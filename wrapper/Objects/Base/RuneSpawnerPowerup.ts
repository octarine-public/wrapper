import { Runes } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RegisterFieldHandler } from "../NativeToSDK"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_Powerup")
export class RuneSpawnerPowerup extends RuneSpawner {
	@NetworkedBasicField("m_bNextRuneIsWater")
	public readonly NextRuneIsWater = false
	@NetworkedBasicField("m_bWillSpawnNextPowerRune")
	public readonly WillSpawnNextPowerRune = false
	public readonly Type = RuneSpawnerType.Powerup

	protected get SpawnsTime(): [number, number] {
		if (this.LastSpawnTime >= 0) {
			return [this.LastSpawnTime, this.NextSpawnTime]
		}
		return [
			this.CreateTime,
			this.CalculateNextSpawnTime(Runes.PowerUpSpawnEverySeconds)
		]
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
