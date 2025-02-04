import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { GameState } from "../../Utils/GameState"
import { RegisterFieldHandler } from "../NativeToSDK"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_Bounty")
export class RuneSpawnerBounty extends RuneSpawner {
	public readonly Type = RuneSpawnerType.Bounty

	protected get SpawnsTime(): [number, number] {
		if (this.LastSpawnTime >= 0) {
			return [this.LastSpawnTime, this.NextSpawnTime]
		}
		return [
			this.CreateTime,
			this.CalculateNextSpawnTime(Runes.BountySpawnEverySeconds)
		]
	}
}

function UpdateGameData(ent: RuneSpawnerBounty) {
	Runes.BountySpawnEveryMinutes = ent.MaxDuration()
	Runes.BountySpawnEverySeconds = ent.MaxDuration("seconds")
}
RegisterFieldHandler(RuneSpawnerBounty, "m_flLastSpawnTime", (ent, newVal) => {
	const oldValue = ent.LastSpawnTime,
		newValue = newVal as number
	if (oldValue !== newValue) {
		ent.LastSpawnTime = newValue
		UpdateGameData(ent)
	}
})
RegisterFieldHandler(RuneSpawnerBounty, "m_flNextSpawnTime", (ent, newVal) => {
	const oldValue = ent.NextSpawnTime,
		newValue = (newVal as number) + GameState.TickInterval
	if (oldValue !== newValue) {
		ent.NextSpawnTime = newValue
		UpdateGameData(ent)
	}
})
