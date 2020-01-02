import Hero from "../Base/Hero"

export default class LifeStealer extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Life_Stealer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Life_Stealer", LifeStealer)