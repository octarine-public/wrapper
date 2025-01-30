import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RegisterFieldHandler } from "../NativeToSDK"
import { GameRules } from "./Entity"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_Bounty")
export class RuneSpawnerBounty extends RuneSpawner {
	public readonly Type = RuneSpawnerType.Bounty

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
			nextSpawnTime = GameRules.GameTime + Runes.BountySpawnEverySeconds
		}
		return [lastSpawnTime, nextSpawnTime]
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
		newValue = newVal as number
	if (oldValue !== newValue) {
		ent.NextSpawnTime = newValue
		UpdateGameData(ent)
	}
})
