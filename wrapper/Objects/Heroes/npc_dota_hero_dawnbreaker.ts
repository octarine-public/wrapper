import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { ConVarsSDK } from "../../Native/ConVarsSDK"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Dawnbreaker")
export class npc_dota_hero_dawnbreaker extends Hero {
	@NetworkedBasicField("m_nAttackState")
	public AttackState = 0

	public CalculateActivityModifiers(
		activity: GameActivity,
		ar: string[]
	): void {
		super.CalculateActivityModifiers(activity, ar)
		const cooldown = ConVarsSDK.GetFloat(
			"dota_dawnbreaker_attack_combo_cooldown_time",
			0
		)
		if (cooldown >= 0)
			switch (this.AttackState) {
				case 0:
					ar.push("ATTACKCOMBO_A")
					break
				case 1:
					ar.push("ATTACKCOMBO_B")
					break
				case 2:
					ar.push("ATTACKCOMBO_C")
					break
				default:
					break
			}
	}
}
