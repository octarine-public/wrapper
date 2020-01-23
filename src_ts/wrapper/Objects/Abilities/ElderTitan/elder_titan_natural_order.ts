import Ability from "../../Base/Ability"

export default class elder_titan_natural_order extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Elder_Titan_NaturalOrder>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_natural_order", elder_titan_natural_order)
