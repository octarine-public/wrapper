import Hero from "../Base/Hero"

export default class ElderTitan extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Elder_Titan
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Elder_Titan", ElderTitan)
