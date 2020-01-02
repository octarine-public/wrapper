import Hero from "../Base/Hero"

export default class NightStalker extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_NightStalker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_NightStalker", NightStalker)