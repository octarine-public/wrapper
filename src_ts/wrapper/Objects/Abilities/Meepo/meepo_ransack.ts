import Ability from "../../Base/Ability"

export default class meepo_ransack extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Meepo_Ransack>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("meepo_ransack", meepo_ransack)
