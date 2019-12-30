import Ability from "../../Base/Ability"

export default class queenofpain_shadow_strike extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_QueenOfPain_ShadowStrike

	public get AOERadius(): number {
		return this.Owner?.GetTalentValue("special_bonus_unique_queen_of_pain") ?? 0
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("queenofpain_shadow_strike", queenofpain_shadow_strike)
