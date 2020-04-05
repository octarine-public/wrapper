import Hero from "../Base/Hero"

export default class npc_dota_hero_ancient_apparition extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_AncientApparition", npc_dota_hero_ancient_apparition)
