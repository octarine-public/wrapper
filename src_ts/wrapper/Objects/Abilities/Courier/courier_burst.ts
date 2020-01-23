import Ability from "../../Base/Ability"

export default class courier_burst extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Courier_Burst
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_burst", courier_burst)
