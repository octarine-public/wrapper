import Hero from "../Base/Hero"

export default class Lina extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Lina
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Lina", Lina)