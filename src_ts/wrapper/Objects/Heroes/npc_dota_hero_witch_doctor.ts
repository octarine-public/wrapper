import Hero from "../Base/Hero"

export default class npc_dota_hero_witch_doctor extends Hero {
	public NativeEntity: Nullable<C_DOTA_Unit_Hero_WitchDoctor>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_WitchDoctor", npc_dota_hero_witch_doctor)
