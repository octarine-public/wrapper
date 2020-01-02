import Hero from "../Base/Hero"

export default class SandKing extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_SandKing
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_SandKing", SandKing)