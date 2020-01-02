import Hero from "../Base/Hero"

export default class Centaur extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Centaur
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Centaur", Centaur)
