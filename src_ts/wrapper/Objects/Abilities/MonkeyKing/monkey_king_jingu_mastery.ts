import Ability from "../../Base/Ability"

export default class monkey_king_jingu_mastery extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_MonkeyKing_QuadrupleTap>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_jingu_mastery", monkey_king_jingu_mastery)
