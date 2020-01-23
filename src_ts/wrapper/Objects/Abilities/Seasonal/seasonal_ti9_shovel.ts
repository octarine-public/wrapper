import Ability from "../../Base/Ability"

export default class seasonal_ti9_shovel extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Seasonal_TI9_Shovel>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_ti9_shovel", seasonal_ti9_shovel)
