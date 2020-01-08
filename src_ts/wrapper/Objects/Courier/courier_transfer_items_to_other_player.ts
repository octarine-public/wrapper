import Ability from "../Base/Ability"

export default class courier_transfer_items_to_other_player extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Courier_TransferItems_ToOtherPlayer
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_transfer_items_to_other_player", courier_transfer_items_to_other_player)
