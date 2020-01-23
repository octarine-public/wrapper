import Ability from "../../Base/Ability"

export default class monkey_king_wukongs_command extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_MonkeyKing_FurArmy>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_wukongs_command", monkey_king_wukongs_command)
