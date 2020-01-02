import Hero from "../Base/Hero"

export default class Lycan extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Lycan
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Lycan", Lycan)
