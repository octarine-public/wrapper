import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RegisterFieldHandler } from "../NativeToSDK"
import { RuneSpawner } from "./RuneSpawner"

@WrapperClass("CDOTA_Item_RuneSpawner_Bounty")
export class RuneSpawnerBounty extends RuneSpawner {
	public readonly Type = RuneSpawnerType.Bounty
}

function UpdateGameData(ent: RuneSpawnerBounty) {
	Runes.BountySpawnEveryMinutes = ent.MaxDuration()
	Runes.BountySpawnEverySeconds = ent.MaxDuration("seconds")
}

RegisterFieldHandler(RuneSpawnerBounty, "m_flLastSpawnTime", (ent, newVal) => {
	const oldState = ent.LastSpawnTime
	ent.LastSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime && oldState !== -1000) {
		UpdateGameData(ent)
	}
})

RegisterFieldHandler(RuneSpawnerBounty, "m_flNextSpawnTime", (ent, newVal) => {
	const oldState = ent.NextSpawnTime
	ent.NextSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime && oldState !== -1000) {
		UpdateGameData(ent)
	}
})
