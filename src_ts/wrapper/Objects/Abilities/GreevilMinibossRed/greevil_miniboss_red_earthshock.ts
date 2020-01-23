import Ability from "../../Base/Ability"

export default class greevil_miniboss_red_earthshock extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Greevil_Miniboss_Red_Earthshock>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_red_earthshock", greevil_miniboss_red_earthshock)
