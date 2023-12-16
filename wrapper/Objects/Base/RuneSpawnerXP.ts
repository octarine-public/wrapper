import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RegisterFieldHandler } from "../NativeToSDK"
import { GameRules } from "./Entity"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_XP")
export class RuneSpawnerXP extends RuneSpawner {
	public readonly Type = RuneSpawnerType.XP

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
			nextSpawnTime = GameRules.GameTime + Runes.XPSpawnEverySeconds
		}
		return [lastSpawnTime, nextSpawnTime]
	}
}

function UpdateGameData(ent: RuneSpawnerXP) {
	Runes.XPSpawnEveryMinutes = ent.MaxDuration()
	Runes.XPSpawnEverySeconds = ent.MaxDuration("seconds")
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
