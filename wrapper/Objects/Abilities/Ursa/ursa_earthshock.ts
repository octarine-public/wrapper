import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("ursa_earthshock")
export default class ursa_earthshock extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		let baseAOE = this.GetSpecialValue("shock_radius", level)
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_ursa_5")
		if (talent !== undefined && talent.Level !== 0)
			baseAOE += talent.GetSpecialValue("value")
		return baseAOE
	}
}
