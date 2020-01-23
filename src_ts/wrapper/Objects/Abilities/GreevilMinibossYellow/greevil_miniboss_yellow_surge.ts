import Ability from "../../Base/Ability"

export default class greevil_miniboss_yellow_surge extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Greevil_Miniboss_Yellow_Surge>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_yellow_surge", greevil_miniboss_yellow_surge)
