import Ability from "../Base/Ability"

export default class courier_dequeue_pickup_from_stash extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Courier_DequeuePickupFromStash
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_dequeue_pickup_from_stash", courier_dequeue_pickup_from_stash)
