import Hero from "../Base/Hero"

export default class DarkSeer extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_DarkSeer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DarkSeer", DarkSeer)
