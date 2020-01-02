import Hero from "../Base/Hero"

export default class Gyrocopter extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Gyrocopter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Gyrocopter", Gyrocopter)