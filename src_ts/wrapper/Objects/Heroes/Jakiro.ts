import Hero from "../Base/Hero"

export default class Jakiro extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Jakiro
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Jakiro", Jakiro)