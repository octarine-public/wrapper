import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("ursa_earthshock")
export default class ursa_earthshock extends Ability {
	public get AOERadius() {
		const owner = this.Owner
		if (owner === undefined)
			return 0
		const baseAOE = this.GetSpecialValue("shock_radius")
		const talent = owner.GetAbilityByName("special_bonus_unique_ursa_5")
		if (talent !== undefined && talent.Level !== 0)
			return baseAOE + talent.GetSpecialValue("value")
		return baseAOE
	}
}
