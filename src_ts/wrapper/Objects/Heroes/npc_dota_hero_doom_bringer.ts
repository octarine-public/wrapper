import Hero from "../Base/Hero"

export default class npc_dota_hero_doom_bringer extends Hero {
	public readonly NativeEntity!: C_DOTA_Unit_Hero_DoomBringer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DoomBringer", npc_dota_hero_doom_bringer)
