import Hero from "../Base/Hero"

export default class Warlock extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Warlock
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Warlock", Warlock)