import Ability from "../../Base/Ability"

export default class seasonal_throw_snowball extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Seasonal_Throw_Snowball>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("seasonal_throw_snowball", seasonal_throw_snowball)
