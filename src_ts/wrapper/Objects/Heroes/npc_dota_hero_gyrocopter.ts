import Hero from "../Base/Hero"

export default class npc_dota_hero_gyrocopter extends Hero {
	public NativeEntity: Nullable<CDOTA_Unit_Hero_Gyrocopter>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Gyrocopter", npc_dota_hero_gyrocopter)
