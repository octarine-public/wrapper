import Ability from "../../Base/Ability"

export default class gyrocopter_homing_missile extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Gyrocopter_Homing_Missile>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("gyrocopter_homing_missile", gyrocopter_homing_missile)
