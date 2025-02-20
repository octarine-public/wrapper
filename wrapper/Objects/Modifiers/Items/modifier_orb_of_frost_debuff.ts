import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_frost_debuff extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name
	private slowMelee = 0
	private slowRanged = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const value = this.HasMeleeAttacksBonuses() ? this.slowMelee : this.slowRanged
		return [value, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_orb_of_frost"
		this.slowMelee = this.GetSpecialValue("slow_melee", name)
		this.slowRanged = this.GetSpecialValue("slow_ranged", name)
	}
}
