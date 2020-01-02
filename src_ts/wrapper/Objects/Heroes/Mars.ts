import Hero from "../Base/Hero"

export default class Mars extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Mars
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Mars", Mars)
