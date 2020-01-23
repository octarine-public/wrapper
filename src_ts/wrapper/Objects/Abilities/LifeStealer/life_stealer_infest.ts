import Ability from "../../Base/Ability"

export default class life_stealer_infest extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Life_Stealer_Infest>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_infest", life_stealer_infest)
