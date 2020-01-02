import Hero from "../Base/Hero"

export default class Omniknight extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Omniknight
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Omniknight", Omniknight)