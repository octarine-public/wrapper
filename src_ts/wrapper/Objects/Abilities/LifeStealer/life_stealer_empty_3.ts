import Ability from "../../Base/Ability"

export default class life_stealer_empty_3 extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Life_Stealer_Empty3>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_empty_3", life_stealer_empty_3)
