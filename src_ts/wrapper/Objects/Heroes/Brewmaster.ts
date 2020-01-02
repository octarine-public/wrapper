import Hero from "../Base/Hero"

export default class Brewmaster extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Brewmaster
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Brewmaster", Brewmaster)
