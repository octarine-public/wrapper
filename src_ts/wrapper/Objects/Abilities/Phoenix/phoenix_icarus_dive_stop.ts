import Ability from "../../Base/Ability"

export default class phoenix_icarus_dive_stop extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Phoenix_IcarusDiveStop>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phoenix_icarus_dive_stop", phoenix_icarus_dive_stop)
