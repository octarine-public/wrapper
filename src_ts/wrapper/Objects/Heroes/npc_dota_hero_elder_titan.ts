import Hero from "../Base/Hero"

export default class npc_dota_hero_elder_titan extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Elder_Titan", npc_dota_hero_elder_titan)
