import Hero from "../Base/Hero"

export default class Weaver extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Weaver
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Weaver", Weaver)
