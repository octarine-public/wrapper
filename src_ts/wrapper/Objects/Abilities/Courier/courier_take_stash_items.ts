import Ability from "../../Base/Ability"

export default class courier_take_stash_items extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_TakeStashItems
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_take_stash_items", courier_take_stash_items)
