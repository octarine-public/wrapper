import Hero from "../Base/Hero"

export default class npc_dota_hero_mars extends Hero {
	public NativeEntity: Nullable<CDOTA_Unit_Hero_Mars>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Mars", npc_dota_hero_mars)
