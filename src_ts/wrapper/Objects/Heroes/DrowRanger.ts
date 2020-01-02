import Hero from "../Base/Hero"

export default class DrowRanger extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_DrowRanger
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DrowRanger", DrowRanger)
