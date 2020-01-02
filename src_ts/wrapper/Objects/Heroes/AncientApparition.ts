import Hero from "../Base/Hero"

export default class AncientApparition extends Hero {
	public readonly m_pBaseEntity!: CDOTA_Unit_Hero_AncientApparition
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("CDOTA_Unit_Hero_AncientApparition", AncientApparition)
