import Hero from "../Base/Hero"

export default class CrystalMaiden extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_CrystalMaiden
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_CrystalMaiden", CrystalMaiden)
