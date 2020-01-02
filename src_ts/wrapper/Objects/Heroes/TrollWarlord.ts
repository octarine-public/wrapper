import Hero from "../Base/Hero"

export default class TrollWarlord extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_TrollWarlord
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_TrollWarlord", TrollWarlord)
