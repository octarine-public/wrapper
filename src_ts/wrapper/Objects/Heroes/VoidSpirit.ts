import Hero from "../Base/Hero"

export default class VoidSpirit extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Void_Spirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Void_Spirit", VoidSpirit)
