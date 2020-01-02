import Hero from "../Base/Hero"

export default class Tusk extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Tusk
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Tusk", Tusk)
