import Hero from "../Base/Hero"

export default class PhantomAssassin extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_PhantomAssassin
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_PhantomAssassin", PhantomAssassin)
