import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_krill_eater extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	private cachedRange = 0
	private cachedRangePerLevel = 0

	protected GetAttackRangeBonus(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		let value = this.cachedRange
		if (owner.Level > 1) {
			value += this.cachedRangePerLevel * owner.Level
		}
		return [value, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "tidehunter_krill_eater"
		this.cachedRange = this.GetSpecialValue("attack_range_base", name)
		this.cachedRangePerLevel = this.GetSpecialValue("attack_range_per_level", name)
	}
}
