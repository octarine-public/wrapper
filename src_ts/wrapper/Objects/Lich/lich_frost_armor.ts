import Ability from "../Base/Ability"

export default class lich_frost_armor extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lich_FrostArmor
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lich_frost_armor", lich_frost_armor)
