import Hero from "../Base/Hero"

export default class Puck extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Puck
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Puck", Puck)