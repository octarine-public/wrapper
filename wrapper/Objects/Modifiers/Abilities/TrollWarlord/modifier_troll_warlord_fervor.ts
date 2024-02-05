import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_fervor extends Modifier {
	public SetBonusAttackSpeed(specialName = "attack_speed", _subtract = false): void {
		const value = this.GetSpecialValue(specialName)
		const maxStacks = this.GetSpecialValue("max_stacks")
		this.BonusAttackSpeed = value * Math.min(this.StackCount, maxStacks)
	}
}
