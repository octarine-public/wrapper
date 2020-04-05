import Hero from "../Base/Hero"

export default class npc_dota_hero_abyssal_underlord extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_AbyssalUnderlord", npc_dota_hero_abyssal_underlord)
