import Ability from "../../Base/Ability"

export default class life_stealer_empty_1 extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Life_Stealer_Empty1>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_empty_1", life_stealer_empty_1)
