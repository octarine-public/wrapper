import Hero from "../Base/Hero"

export default class npc_dota_hero_mirana extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Mirana", npc_dota_hero_mirana)
