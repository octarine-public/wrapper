import Hero from "../Base/Hero"

export default class npc_dota_hero_puck extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Puck", npc_dota_hero_puck)
