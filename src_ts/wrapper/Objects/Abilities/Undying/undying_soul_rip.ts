import Ability from "../../Base/Ability"

export default class undying_soul_rip extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Undying_SoulRip>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("undying_soul_rip", undying_soul_rip)
