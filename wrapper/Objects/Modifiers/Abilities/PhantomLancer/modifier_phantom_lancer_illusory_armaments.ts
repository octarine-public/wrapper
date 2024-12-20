import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phantom_lancer_illusory_armaments extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_PREATTACK_BONUS_DAMAGE,
			this.GetIgnorePreAttackBonusDamage.bind(this)
		]
	])

	protected GetIgnorePreAttackBonusDamage(): [number, boolean] {
		return [1, false]
	}
}
