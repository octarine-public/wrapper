import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_antimage_mana_thirst extends Modifier {
	private cachedMin = 0
	private cachedMax = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		const min = this.cachedMin,
			max = this.cachedMax,
			maxDamage = this.cachedDamage
		if (min === max) {
			return [maxDamage, false]
		}
		return [(this.StackCount * maxDamage) / (min - max), false]
	}

	protected UpdateSpecialValues() {
		const name = "antimage_mana_void"
		this.cachedMax = this.GetSpecialValue("max_bonus_pct", name)
		this.cachedMin = this.GetSpecialValue("min_bonus_pct", name)
		this.cachedDamage = this.GetSpecialValue("bonus_attack_damage", name)
	}
}
