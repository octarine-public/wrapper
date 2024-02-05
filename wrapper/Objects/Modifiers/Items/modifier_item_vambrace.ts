import { WrapperClassModifier } from "../../../Decorators"
import { VambraceAttribute } from "../../../Enums/VambraceAttribute"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_vambrace extends Modifier {
	protected SetBonusMoveSpeed(_specialName?: string, subtract = false): void {
		switch (this.StackCount) {
			case VambraceAttribute.AGILITY:
				super.SetBonusAttackSpeed("bonus_attack_speed", subtract)
				break
			default:
				this.BonusAttackSpeed = 0
				break
		}
	}
}
