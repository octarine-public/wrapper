import Ability from "../../Base/Ability"

export default class monkey_king_untransform extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_MonkeyKing_UnTransform>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_untransform", monkey_king_untransform)
