import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_lance_of_pursuit_slow extends Modifier {
	private slowMelee = 0
	private slowRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const caster = this.Caster
		if (caster === undefined) {
			return [0, false]
		}
		const value = this.HasMeleeAttacksBonuses(caster)
			? this.slowMelee
			: this.slowRanged
		return [-value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		const name = "item_lance_of_pursuit"
		this.slowMelee = this.GetSpecialValue("slow_pct_melee", name)
		this.slowRanged = this.GetSpecialValue("slow_pct_ranged", name)
	}
}
