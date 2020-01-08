import Ability from "../Base/Ability"

export default class ogre_magi_frost_armor extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_OgreMagi_FrostArmor
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ogre_magi_frost_armor", ogre_magi_frost_armor)
