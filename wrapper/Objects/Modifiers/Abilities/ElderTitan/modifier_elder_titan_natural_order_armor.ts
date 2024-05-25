import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_natural_order_armor extends Modifier {
	public readonly IsDebuff = true

	protected SetBaseBonusArmorAmplifier(
		specialName = "armor_reduction_pct",
		subtract = true
	) {
		super.SetBaseBonusArmorAmplifier(specialName, subtract)
	}

	protected SetBonusArmor(_specialName?: string, _subtract = true) {
		const isImmune = this.IsMagicImmune() || this.IsDebuffImmune()
		const isPassiveDisabled = this.IsPassiveDisabled()
		if (isPassiveDisabled || isImmune) {
			this.BonusArmor = 0
			return
		}
		const stackCount = this.StackCount + 1
		this.BonusArmor = -Math.min(stackCount, this.GetSpecialValue("max_stacks"))
	}
}
