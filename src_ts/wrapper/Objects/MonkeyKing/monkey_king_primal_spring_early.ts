import Ability from "../Base/Ability"

export default class monkey_king_primal_spring_early extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_MonkeyKing_Spring_Early
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("monkey_king_primal_spring_early", monkey_king_primal_spring_early)
