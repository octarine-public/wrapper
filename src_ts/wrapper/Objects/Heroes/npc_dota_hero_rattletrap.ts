import Hero from "../Base/Hero"

export default class npc_dota_hero_rattletrap extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Rattletrap", npc_dota_hero_rattletrap)
