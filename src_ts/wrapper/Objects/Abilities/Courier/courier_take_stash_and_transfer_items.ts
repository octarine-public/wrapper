import Ability from "../../Base/Ability"

export default class courier_take_stash_and_transfer_items extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_TakeStashAndTransferItems
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_take_stash_and_transfer_items", courier_take_stash_and_transfer_items)
