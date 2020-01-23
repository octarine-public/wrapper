import Ability from "../../Base/Ability"

export default class visage_grave_chill extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Visage_GraveChill>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("visage_grave_chill", visage_grave_chill)
