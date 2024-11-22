import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_static_link extends Modifier {
	// protected readonly DeclaredFunction = new Map([
	// 	[
	// 		EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
	// 		this.GetAttackRangeBonus.bind(this)
	// 	]
	// ])
	// protected GetAttackRangeBonus(): [number, boolean] { // base 800
	// 	const ability = this.Ability
	// 	if (ability === undefined) {
	// 		return [0, false]
	// 	}
	// 	return [ability.CastRange, false]
	// }
}
