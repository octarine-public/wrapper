import Ability from "../../Base/Ability"

export default class greevil_miniboss_blue_cold_feet extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Greevil_Miniboss_Blue_ColdFeet>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_blue_cold_feet", greevil_miniboss_blue_cold_feet)
