import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_chilling_touch extends Modifier {
	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		const isEnabled = this.Ability?.IsAutoCastEnabled ?? false,
			isCooldownReady = this.Ability?.IsCooldownReady ?? false
		return isEnabled && isCooldownReady ? [this.cachedRange, false] : [0, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"attack_range_bonus",
			"ancient_apparition_chilling_touch"
		)
	}
}
