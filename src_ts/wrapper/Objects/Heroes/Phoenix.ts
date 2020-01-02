import Hero from "../Base/Hero"

export default class Phoenix extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Phoenix
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Phoenix", Phoenix)