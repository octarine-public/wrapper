import Hero from "../Base/Hero"

export default class DeathProphet extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_DeathProphet
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DeathProphet", DeathProphet)
