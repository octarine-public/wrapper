import { AttackSpeedData, Runes } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { EventsSDK } from "../../Managers/EventsSDK"
import { ConVarsSDK } from "../../Native/ConVarsSDK"
import { Entity } from "./Entity"

@WrapperClass("CWorld")
export class World extends Entity {}

function UpdateGameData() {
	AttackSpeedData.SetMinMaxFactorInternal(
		ConVarsSDK.GetFloat("dota_min_haste", 0.1),
		ConVarsSDK.GetFloat("dota_max_haste", 7),
		ConVarsSDK.GetFloat("dota_special_attack_delay", 0)
	)
	Runes.XPSpawnEverySeconds = ConVarsSDK.GetFloat(
		"dota_xp_fountain_activation_interval",
		Runes.XPSpawnEverySeconds
	)
	Runes.XPSpawnEveryMinutes = Runes.XPSpawnEverySeconds / 60
}

EventsSDK.on("PreEntityCreated", ent => {
	if (ent instanceof World) {
		UpdateGameData()
	}
})
