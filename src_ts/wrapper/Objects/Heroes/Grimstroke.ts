import Hero from "../Base/Hero"

export default class Grimstroke extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Grimstroke
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Grimstroke", Grimstroke)