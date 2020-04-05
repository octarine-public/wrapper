import Hero from "../Base/Hero"

export default class npc_dota_hero_centaur extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Centaur", npc_dota_hero_centaur)
