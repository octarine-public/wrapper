import Hero from "../Base/Hero"

export default class BountyHunter extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_BountyHunter
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_BountyHunter", BountyHunter)
