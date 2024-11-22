import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_destruction_debuff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private slowMelee = 0
	private slowRanged = 0

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

	protected UpdateSpecialValues(): void {
		const name = "item_orb_of_destruction"
		this.slowMelee = this.GetSpecialValue("slow_melee", name)
		this.slowRanged = this.GetSpecialValue("slow_range", name)
	}
}
