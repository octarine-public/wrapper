import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("queenofpain_shadow_strike")
export default class queenofpain_shadow_strike extends Ability {
	public get AOERadius(): number {
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_queen_of_pain")
		if (talent !== undefined && talent.Level !== 0)
			return talent.GetSpecialValue("value")
		return 0
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_queenofpain/queen_shadow_strike.vpcf",
			"particles/econ/items/queen_of_pain/qop_ti8_immortal/queen_ti8_shadow_strike.vpcf",
			"particles/econ/items/queen_of_pain/qop_ti8_immortal/queen_ti8_golden_shadow_strike.vpcf",
		]
	}
}
