import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_void_spirit_intrinsic_edge extends Modifier {
	private cachedBaseMResBonus = 0
	private cachedBaseArmorBonus = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_MRES_PER_INT_BONUS_PERCENTAGE,
			this.GetBaseMresPerIntBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BASE_ARMOR_PER_AGI_BONUS_PERCENTAGE,
			this.GetBaseArmorPerAgiBonusPercentage.bind(this)
		]
	])

	protected GetBaseMresPerIntBonusPercentage(): [number, boolean] {
		return [this.cachedBaseMResBonus, false]
	}

	protected GetBaseArmorPerAgiBonusPercentage(): [number, boolean] {
		return [this.cachedBaseArmorBonus, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "void_spirit_intrinsic_edge"
		this.cachedBaseArmorBonus = this.GetSpecialValue("secondary_stat_bonus_pct", name)
		this.cachedBaseMResBonus = this.cachedBaseArmorBonus
	}
}
