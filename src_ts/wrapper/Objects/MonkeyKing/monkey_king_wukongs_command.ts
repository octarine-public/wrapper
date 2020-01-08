import Ability from "../Base/Ability"

export default class monkey_king_wukongs_command extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_MonkeyKing_FurArmy
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_wukongs_command", monkey_king_wukongs_command)
