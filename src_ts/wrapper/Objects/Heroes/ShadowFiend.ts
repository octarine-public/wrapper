import Hero from "../Base/Hero"

export default class ShadowFiend extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Nevermore
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Nevermore", ShadowFiend)
