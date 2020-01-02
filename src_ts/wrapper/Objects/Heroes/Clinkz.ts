import Hero from "../Base/Hero"

export default class Clinkz extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Clinkz
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Clinkz", Clinkz)
