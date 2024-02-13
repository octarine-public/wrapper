import { AttackSpeedData } from "../../Data/GameData"
import { WrapperClass } from "../../Decorators"
import { EventsSDK } from "../../Managers/EventsSDK"
import { ConVarsSDK } from "../../Native/ConVarsSDK"
import { Entity } from "./Entity"

@WrapperClass("CWorld")
export class World extends Entity {}

EventsSDK.on("PreEntityCreated", ent => {
	if (!(ent instanceof World)) {
		return
	}
	AttackSpeedData._UpdateMinMax(
		ConVarsSDK.GetFloat("dota_min_haste", 0),
		ConVarsSDK.GetFloat("dota_max_haste", 0),
		ConVarsSDK.GetFloat("dota_special_attack_delay", 0)
	)
})
