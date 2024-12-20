import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bane_enfeeble_effect extends Modifier {
	private cachedDamage = 0
	private cachedCastRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_PERCENTAGE,
			this.GetCastRangeBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])

	protected GetCastRangeBonusPercentage(): [number, boolean] {
		return [-this.cachedCastRange, this.IsMagicImmune()]
	}

	protected GetPreAttackBonusDamagePercentage(
		_params?: IModifierParams
	): [number, boolean] {
		return [-this.cachedDamage, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "bane_enfeeble"
		this.cachedDamage = this.GetSpecialValue("damage_reduction", name)
		this.cachedCastRange = this.GetSpecialValue("cast_reduction", name)
	}
}
