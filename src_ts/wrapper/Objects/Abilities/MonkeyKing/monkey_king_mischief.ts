import Ability from "../../Base/Ability"

export default class monkey_king_mischief extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_MonkeyKing_Transform>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_mischief", monkey_king_mischief)
