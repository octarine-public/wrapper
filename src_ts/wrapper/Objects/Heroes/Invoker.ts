import Hero from "../Base/Hero"

export default class Invoker extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Invoker
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Invoker", Invoker)
