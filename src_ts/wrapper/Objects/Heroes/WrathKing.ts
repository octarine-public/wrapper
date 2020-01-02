import Hero from "../Base/Hero"

export default class WrathKing extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_SkeletonKing
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_WitchDoctor", WrathKing)
