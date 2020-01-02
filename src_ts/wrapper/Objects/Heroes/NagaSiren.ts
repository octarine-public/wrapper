import Hero from "../Base/Hero"

export default class NagaSiren extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Naga_Siren
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Naga_Siren", NagaSiren)
