import Ability from "../../Base/Ability"

export default class monkey_king_boundless_strike extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_MonkeyKing_Boundless_Strike>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_boundless_strike", monkey_king_boundless_strike)
