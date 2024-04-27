import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_skywrath_mage_shard_bonus_counter extends Modifier {
	protected SetBonusArmor(specialName = "bonus_armor", _subtract = false): void {
		const value = this.GetSpecialValue(specialName)
		this.BonusArmor = value * Math.max(this.StackCount, 0)
	}
}
