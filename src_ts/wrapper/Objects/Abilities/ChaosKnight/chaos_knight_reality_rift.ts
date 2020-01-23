import Ability from "../../Base/Ability"

export default class chaos_knight_reality_rift extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_ChaosKnight_Reality_Rift
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("chaos_knight_reality_rift", chaos_knight_reality_rift)
