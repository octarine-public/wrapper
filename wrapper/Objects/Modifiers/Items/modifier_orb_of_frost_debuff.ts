import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_frost_debuff extends Modifier implements IDebuff {
	private static readonly modifiers = [
		"modifier_orb_of_corrosion_debuff",
		"modifier_item_skadi_slow"
	]

	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name
	private slowMelee = 0
	private slowRanged = 0
	private ignoreBonusMoveSpeed = false

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
		if (this.ignoreBonusMoveSpeed) {
			return [0, false]
		}
		const value = this.HasMeleeAttacksBonuses() ? this.slowMelee : this.slowRanged
		return [value, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "item_orb_of_frost"
		this.slowMelee = this.GetSpecialValue("slow_melee", name)
		this.slowRanged = this.GetSpecialValue("slow_ranged", name)
		this.setIgnoreBonusMoveSpeed()
	}
	protected UnitPropertyChanged(changed?: boolean): boolean {
		if (!super.UnitPropertyChanged(changed)) {
			return true
		}
		this.setIgnoreBonusMoveSpeed()
		return true
	}
	private setIgnoreBonusMoveSpeed(): void {
		this.ignoreBonusMoveSpeed =
			this.Parent?.HasAnyBuffByNames(modifier_orb_of_frost_debuff.modifiers) ??
			false
	}
}
