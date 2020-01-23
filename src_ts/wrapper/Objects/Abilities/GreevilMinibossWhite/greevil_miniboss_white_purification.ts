import Ability from "../../Base/Ability"

export default class greevil_miniboss_white_purification extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Greevil_Miniboss_White_Purification>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_white_purification", greevil_miniboss_white_purification)
