import Hero from "../Base/Hero"

export default class Furion extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Furion
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Furion", Furion)
