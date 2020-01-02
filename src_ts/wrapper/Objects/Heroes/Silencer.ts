import Hero from "../Base/Hero"

export default class Silencer extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Silencer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Silencer", Silencer)