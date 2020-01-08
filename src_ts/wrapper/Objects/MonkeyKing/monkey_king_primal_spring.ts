import Ability from "../Base/Ability"

export default class monkey_king_primal_spring extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_MonkeyKing_Spring
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_primal_spring", monkey_king_primal_spring)
