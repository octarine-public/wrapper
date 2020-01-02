import Hero from "../Base/Hero"

export default class FacelessVoid extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_FacelessVoid
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_FacelessVoid", FacelessVoid)