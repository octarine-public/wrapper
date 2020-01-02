import Hero from "../Base/Hero"

export default class Underlord extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_AbyssalUnderlord
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_AbyssalUnderlord", Underlord)
