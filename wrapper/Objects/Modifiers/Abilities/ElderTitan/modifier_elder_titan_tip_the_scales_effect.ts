import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_tip_the_scales_effect extends Modifier {
	private cachedBonusDamage = 0
	private cachedBonusDamageValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined || owner === this.Caster) {
			this.cachedBonusDamage = 0
			return
		}
		const hasGlyph = owner.HasBuffByName("modifier_fountain_glyph")
		if (!hasGlyph) {
			this.cachedBonusDamage = 0
			return
		}
		this.cachedBonusDamage = this.cachedBonusDamageValue
	}

	protected GetPreAttackBonusDamagePercentage(): [number, boolean] {
		return [this.cachedBonusDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedBonusDamageValue = this.GetSpecialValue(
			"damage_bonus",
			"elder_titan_tip_the_scales"
		)
	}
}
