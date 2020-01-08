import Ability from "../Base/Ability"

export default class chaos_knight_phantasm extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_ChaosKnight_Phantasm
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chaos_knight_phantasm", chaos_knight_phantasm)
