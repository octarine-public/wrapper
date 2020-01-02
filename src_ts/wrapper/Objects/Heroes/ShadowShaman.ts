import Hero from "../Base/Hero"

export default class ShadowShaman extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_ShadowShaman
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_ShadowShaman", ShadowShaman)