import { Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { RuneSpawnerType } from "../../Enums/RuneSpawnerType"
import { RuneSpawner } from "../Extensions/RuneSpawner"
import { RegisterFieldHandler } from "../NativeToSDK"

@WrapperClass("CDOTA_Item_RuneSpawner_Bounty")
export class RuneSpawnerBounty extends RuneSpawner {
	public readonly Type = RuneSpawnerType.Bounty
}
function UpdateGameData(ent: RuneSpawnerBounty) {
	Runes.BountySpawnEveryMinutes = ent.RuneSpawnTime()
	Runes.BountySpawnEverySeconds = ent.RuneSpawnTime("seconds")
}

RegisterFieldHandler(RuneSpawnerBounty, "m_flLastSpawnTime", (ent, newVal) => {
	const oldState = ent.LastSpawnTime
	ent.LastSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime) {
		UpdateGameData(ent)
	}
})

RegisterFieldHandler(RuneSpawnerBounty, "m_flNextSpawnTime", (ent, newVal) => {
	const oldState = ent.NextSpawnTime
	ent.NextSpawnTime = newVal as number
	if (ent.IsValid && oldState !== ent.LastSpawnTime) {
		UpdateGameData(ent)
	}
})
