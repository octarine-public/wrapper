import Hero from "../Base/Hero"

export default class Lion extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Lion
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Lion", Lion)