import Hero from "../Base/Hero"

export default class npc_dota_hero_arc_warden extends Hero {
	public NativeEntity: Nullable<CDOTA_Unit_Hero_ArcWarden>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_ArcWarden", npc_dota_hero_arc_warden)
