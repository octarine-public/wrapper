import Ability from "../../Base/Ability"

export default class courier_return_to_base extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_ReturnToBase
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_return_to_base", courier_return_to_base)
