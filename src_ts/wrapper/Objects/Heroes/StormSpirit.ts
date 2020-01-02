import Hero from "../Base/Hero"

export default class StormSpirit extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_StormSpirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_StormSpirit", StormSpirit)