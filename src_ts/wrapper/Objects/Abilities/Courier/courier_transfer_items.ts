import Ability from "../../Base/Ability"

export default class courier_transfer_items extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_TransferItems
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_transfer_items", courier_transfer_items)
