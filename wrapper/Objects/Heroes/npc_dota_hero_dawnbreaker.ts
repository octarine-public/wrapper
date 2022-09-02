import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { GameActivity_t } from "../../Enums/GameActivity_t"
import Hero from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Dawnbreaker")
export default class npc_dota_hero_dawnbreaker extends Hero {
	@NetworkedBasicField("m_nAttackState")
	public AttackState = 0

	public CalculateActivityModifiers(activity: GameActivity_t, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		let cooldown = ConVars.Get("dota_dawnbreaker_attack_combo_cooldown_time")
		if (typeof cooldown !== "number")
			cooldown = 0
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
