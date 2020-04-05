import Hero from "../Base/Hero"

export default class npc_dota_hero_shadow_demon extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Shadow_Demon", npc_dota_hero_shadow_demon)
