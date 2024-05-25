import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_uproar extends Modifier {
	protected SetBonusArmor(specialName = "roared_bonus_armor", _subtract = false): void {
		this.BonusArmor = this.calculateByStackCount(specialName)
	}

	protected SetBonusAOERadiusAmplifier(
		specialName = "roared_bonus_aoe_pct",
		_subtract = false
	): void {
		this.BonusAOERadiusAmplifier = this.calculateByStackCount(specialName, true)
	}

	private calculateByStackCount(specialName: string, isAmp = false) {
		const owner = this.Parent
		if (owner === undefined) {
			return 0
		}
		let specialValue = this.GetSpecialValue(specialName)
		if (isAmp) {
			specialValue /= 100
		}
		return owner.HasBuffByName("modifier_primal_beast_roared_self")
			? specialValue * this.StackCount
			: 0
	}
}
