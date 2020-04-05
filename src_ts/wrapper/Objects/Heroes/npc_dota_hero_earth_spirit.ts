import Hero from "../Base/Hero"

export default class npc_dota_hero_earth_spirit extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_EarthSpirit", npc_dota_hero_earth_spirit)
