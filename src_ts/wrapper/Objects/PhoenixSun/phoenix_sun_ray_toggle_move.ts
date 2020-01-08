import Ability from "../Base/Ability"

export default class phoenix_sun_ray_toggle_move extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Phoenix_SunRayToggleMove
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phoenix_sun_ray_toggle_move", phoenix_sun_ray_toggle_move)
