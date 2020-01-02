import Hero from "../Base/Hero"

export default class Riki extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_Riki
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_Riki", Riki)
