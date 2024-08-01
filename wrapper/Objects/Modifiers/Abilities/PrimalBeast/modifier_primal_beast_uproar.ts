import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_uproar extends Modifier {
	protected SetBonusArmor(specialName = "roared_bonus_armor", _subtract = false): void {
		this.BonusArmor = this.calculateByStackCount(specialName)
	}

	private calculateByStackCount(specialName: string) {
		const owner = this.Parent
		if (owner === undefined) {
			return 0
		}
		return owner.HasBuffByName("modifier_primal_beast_roared_self")
			? this.GetSpecialValue(specialName) * this.StackCount
			: 0
	}
}
