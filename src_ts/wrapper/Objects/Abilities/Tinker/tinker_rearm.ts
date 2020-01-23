import Ability from "../../Base/Ability"

export default class tinker_rearm extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Tinker_Rearm>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("tinker_rearm", tinker_rearm)
