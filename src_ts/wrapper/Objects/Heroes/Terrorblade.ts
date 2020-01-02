import Hero from "../Base/Hero"

export default class Terrorblade extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Terrorblade
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Terrorblade", Terrorblade)
