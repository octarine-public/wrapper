import Ability from "../../Base/Ability"

export default class slark_shadow_dance extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Slark_ShadowDance>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("slark_shadow_dance", slark_shadow_dance)
