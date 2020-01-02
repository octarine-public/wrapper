import Hero from "../Base/Hero"

export default class ShadowDemon extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Shadow_Demon
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Shadow_Demon", ShadowDemon)