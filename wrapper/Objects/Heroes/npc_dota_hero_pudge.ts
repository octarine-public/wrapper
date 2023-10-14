import { WrapperClass } from "../../Decorators"
import { GameActivity } from "../../Enums/GameActivity"
import { pudge_meat_hook } from "../Abilities/Pudge/pudge_meat_hook"
import { Hero } from "../Base/Hero"

@WrapperClass("CDOTA_Unit_Hero_Pudge")
export class npc_dota_hero_pudge extends Hero {
	public CalculateActivityModifiers(activity: GameActivity, ar: string[]): void {
		super.CalculateActivityModifiers(activity, ar)
		const hook = this.GetAbilityByClass(pudge_meat_hook)
		if (hook !== undefined) {
			if (hook.ConsecutiveHits >= 3) {
				ar.push("hook_streak_large")
			} else if (hook.ConsecutiveHits >= 2) {
				ar.push("hook_streak_medium")
			} else if (hook.ConsecutiveHits >= 1) {
				ar.push("hook_streak_small")
			}
		}
	}
}
