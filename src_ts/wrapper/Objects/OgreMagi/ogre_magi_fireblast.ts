import Ability from "../Base/Ability"

export default class ogre_magi_fireblast extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Ogre_Magi_Fireblast
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ogre_magi_fireblast", ogre_magi_fireblast)
