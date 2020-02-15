import Ability from "../../Base/Ability"

export default class gyrocopter_rocket_barrage extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Gyrocopter_Rocket_Barrage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("gyrocopter_rocket_barrage", gyrocopter_rocket_barrage)
