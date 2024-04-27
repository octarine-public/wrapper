import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_viper_poison_attack_slow extends Modifier {
	public SetBonusArmor(specialName = "shard_armor_reduction", _subtract = false): void {
		const value = this.GetSpecialArmorByState(specialName)
		this.BonusArmor = -(value * Math.max(this.StackCount, 0))
	}
}
