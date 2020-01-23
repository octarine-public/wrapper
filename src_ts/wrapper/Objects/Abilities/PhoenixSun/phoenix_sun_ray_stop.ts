import Ability from "../../Base/Ability"

export default class phoenix_sun_ray_stop extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Phoenix_SunRayStop>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phoenix_sun_ray_stop", phoenix_sun_ray_stop)
