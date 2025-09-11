import { Runes } from "../../Data/GameData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { EventsSDK } from "../../Managers/EventsSDK"
import { GameState } from "../../Utils/GameState"
import { RegisterFieldHandler } from "../NativeToSDK"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_Powerup")
export class RuneSpawnerPowerup extends RuneSpawner {
	@NetworkedBasicField("m_bNextRuneIsWater")
	public readonly NextRuneIsWater: boolean = false
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
	ent.UpdatePositionByEntityCreated()
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
		newValue = (newVal as number) + GameState.TickInterval
	if (oldValue !== newValue) {
		ent.NextSpawnTime = newValue
		UpdateGameData(ent)
	}
})
EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof RuneSpawnerPowerup) {
		UpdateGameData(ent)
	}
})
