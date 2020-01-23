import Ability from "../../Base/Ability"

export default class courier_return_stash_items extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_ReturnStashItems
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_return_stash_items", courier_return_stash_items)
