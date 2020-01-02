import Hero from "../Base/Hero"

export default class VengefulSpirit extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_VengefulSpirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_VengefulSpirit", VengefulSpirit)
