import Hero from "../Base/Hero"

export default class Enchantress extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Enchantress
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Enchantress", Enchantress)
