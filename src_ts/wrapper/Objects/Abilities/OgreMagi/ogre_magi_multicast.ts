import Ability from "../../Base/Ability"

export default class ogre_magi_multicast extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Ogre_Magi_Multicast>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ogre_magi_multicast", ogre_magi_multicast)
