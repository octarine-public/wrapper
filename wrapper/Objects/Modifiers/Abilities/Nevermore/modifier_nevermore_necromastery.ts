import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nevermore_necromastery extends Modifier {
	private cachedDamagePerStack = 0
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamagePerStack * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamagePerStack = this.GetSpecialValue(
			"necromastery_damage_per_soul",
			"nevermore_necromastery"
		)
	}
}
