import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RuneSpawner } from "../Extensions/RuneSpawner"
import { RegisterFieldHandler } from "../NativeToSDK"

@WrapperClass("CDOTA_Item_RuneSpawner_XP")
export class RuneSpawnerXP extends RuneSpawner {
	public readonly Type = RuneSpawnerType.XP
}

function UpdateGameData(ent: RuneSpawnerXP) {
	Runes.XPSpawnEveryMinutes = ent.RuneSpawnTime()
	Runes.XPSpawnEverySeconds = ent.RuneSpawnTime("seconds")
}

RegisterFieldHandler(RuneSpawnerXP, "m_flLastSpawnTime", (ent, newVal) => {
	const oldState = ent.LastSpawnTime
	ent.LastSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime) {
		UpdateGameData(ent)
	}
})

RegisterFieldHandler(RuneSpawnerXP, "m_flNextSpawnTime", (ent, newVal) => {
	const oldState = ent.NextSpawnTime
	ent.NextSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime) {
		UpdateGameData(ent)
	}
})
