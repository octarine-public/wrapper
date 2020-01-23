import Ability from "../../Base/Ability"

export default class chaos_knight_chaos_strike extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_ChaosKnight_Chaos_Strike
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chaos_knight_chaos_strike", chaos_knight_chaos_strike)
