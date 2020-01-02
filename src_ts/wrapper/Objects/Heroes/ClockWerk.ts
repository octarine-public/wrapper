import Hero from "../Base/Hero"

export default class Rattletrap extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Rattletrap
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Rattletrap", Rattletrap)
