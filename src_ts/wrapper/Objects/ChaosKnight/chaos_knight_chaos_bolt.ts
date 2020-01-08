import Ability from "../Base/Ability"

export default class chaos_knight_chaos_bolt extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_ChaosKnight_Chaos_Bolt
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chaos_knight_chaos_bolt", chaos_knight_chaos_bolt)
