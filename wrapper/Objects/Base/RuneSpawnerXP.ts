import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { GameState } from "../../Utils/GameState"
import { RegisterFieldHandler } from "../NativeToSDK"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_XP")
export class RuneSpawnerXP extends RuneSpawner {
	public readonly Type = RuneSpawnerType.XP

	protected get SpawnsTime(): [number, number] {
		return this.LastSpawnTime >= 0
			? [this.LastSpawnTime, this.NextSpawnTime]
			: [this.CreateTime, this.CalculateNextSpawnTime(Runes.XPSpawnEverySeconds)]
	}
}

function UpdateGameData(ent: RuneSpawnerXP) {
	Runes.XPSpawnEveryMinutes = ent.MaxDuration()
	Runes.XPSpawnEverySeconds = ent.MaxDuration("seconds")
}
RegisterFieldHandler(RuneSpawnerXP, "m_flLastSpawnTime", (ent, newVal) => {
	const oldValue = ent.LastSpawnTime,
		newValue = newVal as number
	if (oldValue !== newValue) {
		ent.LastSpawnTime = newValue
		UpdateGameData(ent)
	}
})
RegisterFieldHandler(RuneSpawnerXP, "m_flNextSpawnTime", (ent, newVal) => {
	const oldValue = ent.NextSpawnTime,
		newValue = (newVal as number) + GameState.TickInterval
	if (oldValue !== newValue) {
		ent.NextSpawnTime = newValue
		UpdateGameData(ent)
	}
})
