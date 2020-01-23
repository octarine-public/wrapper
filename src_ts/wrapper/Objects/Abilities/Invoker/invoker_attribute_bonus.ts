import Ability from "../../Base/Ability"

export default class invoker_attribute_bonus extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Invoker_AttributeBonus>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_attribute_bonus", invoker_attribute_bonus)
