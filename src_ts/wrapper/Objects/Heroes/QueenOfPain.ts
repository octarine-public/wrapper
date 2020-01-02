import Hero from "../Base/Hero"

export default class QueenOfPain extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_QueenOfPain
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_QueenOfPain", QueenOfPain)
