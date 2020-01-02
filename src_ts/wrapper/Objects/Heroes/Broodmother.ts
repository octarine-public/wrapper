import Hero from "../Base/Hero"

export default class Broodmother extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Broodmother
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Broodmother", Broodmother)
