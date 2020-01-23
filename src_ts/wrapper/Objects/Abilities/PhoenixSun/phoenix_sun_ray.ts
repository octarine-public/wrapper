import Ability from "../../Base/Ability"

export default class phoenix_sun_ray extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Phoenix_SunRay>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phoenix_sun_ray", phoenix_sun_ray)
