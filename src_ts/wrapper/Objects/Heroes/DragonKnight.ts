import Hero from "../Base/Hero"

export default class DragonKnight extends Hero {
	public readonly m_pBaseEntity!: C_DOTA_Unit_Hero_DragonKnight
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Unit_Hero_DragonKnight", DragonKnight)
