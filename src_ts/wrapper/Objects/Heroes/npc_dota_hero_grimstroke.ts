import Hero from "../Base/Hero"

export default class npc_dota_hero_grimstroke extends Hero {
	public NativeEntity: Nullable<CDOTA_Unit_Hero_Grimstroke>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Grimstroke", npc_dota_hero_grimstroke)