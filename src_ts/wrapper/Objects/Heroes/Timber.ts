import Hero from "../Base/Hero"

export default class Timber extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Shredder
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Shredder", Timber)