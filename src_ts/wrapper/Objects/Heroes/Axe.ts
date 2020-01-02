import Hero from "../Base/Hero"

export default class Axe extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Axe
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Axe", Axe)
