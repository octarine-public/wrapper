import Ability from "../Base/Ability"

export default class ogre_magi_ignite extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Ogre_Magi_Ignite
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ogre_magi_ignite", ogre_magi_ignite)
