import Hero from "../Base/Hero"

export default class Snapfire extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_Snapfire
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_Snapfire", Snapfire)