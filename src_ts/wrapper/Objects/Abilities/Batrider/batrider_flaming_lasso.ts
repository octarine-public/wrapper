import Ability from "../../Base/Ability"

export default class batrider_flaming_lasso extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Batrider_FlamingLasso>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("batrider_flaming_lasso", batrider_flaming_lasso)
