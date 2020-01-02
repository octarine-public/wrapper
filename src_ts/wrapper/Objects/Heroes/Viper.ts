import Hero from "../Base/Hero"

export default class Viper extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Viper
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Viper", Viper)