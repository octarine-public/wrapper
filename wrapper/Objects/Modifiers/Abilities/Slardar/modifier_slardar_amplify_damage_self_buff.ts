import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_amplify_damage_self_buff extends Modifier {
	protected SetBonusArmor(specialName = "armor_reduction", _subtract = false): void {
		const reduction = Math.abs(this.GetSpecialValue(specialName)) // -10, -15, -20
		const percentOfReduction = this.GetSpecialValue("armor_pct") / 100
		this.BonusArmor = reduction * percentOfReduction * this.StackCount
	}
}
