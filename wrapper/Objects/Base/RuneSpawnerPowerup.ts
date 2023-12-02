import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RegisterFieldHandler } from "../NativeToSDK"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_Powerup")
export class RuneSpawnerPowerup extends RuneSpawner {
	public readonly Type = RuneSpawnerType.Pwowerup
}

function UpdateGameData(ent: RuneSpawnerPowerup) {
	Runes.PowerUpSpawnEveryMinutes = ent.RuneSpawnTime()
	Runes.PowerUpSpawnEverySeconds = ent.RuneSpawnTime("seconds")
}

RegisterFieldHandler(RuneSpawnerPowerup, "m_flLastSpawnTime", (ent, newVal) => {
	const oldState = ent.LastSpawnTime
	ent.LastSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime) {
		UpdateGameData(ent)
	}
})

RegisterFieldHandler(RuneSpawnerPowerup, "m_flNextSpawnTime", (ent, newVal) => {
	const oldState = ent.NextSpawnTime
	ent.NextSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime) {
		UpdateGameData(ent)
	}
})
