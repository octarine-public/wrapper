import Hero from "../Base/Hero"

export default class NyxAssassin extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Nyx_Assassin
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Nyx_Assassin", NyxAssassin)