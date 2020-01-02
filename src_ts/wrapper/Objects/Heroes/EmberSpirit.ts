import Hero from "../Base/Hero"

export default class EmberSpirit extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_EmberSpirit
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_EmberSpirit", EmberSpirit)
