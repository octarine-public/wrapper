import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("queenofpain_shadow_strike")
export default class queenofpain_shadow_strike extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_queenofpain/queen_shadow_strike.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public GetAOERadiusForLevel(level: number): number {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_queen_of_pain")
		if (talent !== undefined && talent.Level !== 0)
			return talent.GetSpecialValue("value", level)
		return 0
	}
}
