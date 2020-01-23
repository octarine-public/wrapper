import Ability from "../../Base/Ability"

export default class courier_queue_pickup_from_stash extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_QueuePickupFromStash
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_queue_pickup_from_stash", courier_queue_pickup_from_stash)
