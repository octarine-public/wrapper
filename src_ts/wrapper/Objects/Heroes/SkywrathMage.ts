import Hero from "../Base/Hero"

export default class SkywrathMage extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Skywrath_Mage
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Skywrath_Mage", SkywrathMage)
