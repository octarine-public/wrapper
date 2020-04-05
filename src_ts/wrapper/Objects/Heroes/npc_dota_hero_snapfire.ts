import Hero from "../Base/Hero"

export default class npc_dota_hero_snapfire extends Hero {
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Snapfire", npc_dota_hero_snapfire)
