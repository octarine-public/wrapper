import Hero from "../Base/Hero"

export default class Venomancer extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Venomancer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Venomancer", Venomancer)