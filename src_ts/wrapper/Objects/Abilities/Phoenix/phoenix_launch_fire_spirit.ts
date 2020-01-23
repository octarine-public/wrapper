import Ability from "../../Base/Ability"

export default class phoenix_launch_fire_spirit extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Phoenix_LaunchFireSpirit>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phoenix_launch_fire_spirit", phoenix_launch_fire_spirit)
