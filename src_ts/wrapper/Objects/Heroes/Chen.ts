import Hero from "../Base/Hero"

export default class Chen extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Chen
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Chen", Chen)
