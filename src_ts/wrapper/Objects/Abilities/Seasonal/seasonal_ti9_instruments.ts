import Ability from "../../Base/Ability"

export default class seasonal_ti9_instruments extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Seasonal_TI9_Instruments>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_ti9_instruments", seasonal_ti9_instruments)
