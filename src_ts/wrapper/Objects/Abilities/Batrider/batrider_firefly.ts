import Ability from "../../Base/Ability"

export default class batrider_firefly extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Batrider_Firefly>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("batrider_firefly", batrider_firefly)
