import Ability from "../../Base/Ability"

export default class seasonal_ti9_banner extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Seasonal_TI9_Banner>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_ti9_banner", seasonal_ti9_banner)
