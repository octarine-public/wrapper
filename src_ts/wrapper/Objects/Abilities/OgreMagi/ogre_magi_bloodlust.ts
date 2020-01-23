import Ability from "../../Base/Ability"

export default class ogre_magi_bloodlust extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Ogre_Magi_Bloodlust>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ogre_magi_bloodlust", ogre_magi_bloodlust)
