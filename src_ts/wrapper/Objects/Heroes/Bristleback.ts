import Hero from "../Base/Hero"

export default class Bristleback extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Bristleback
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Bristleback", Bristleback)