import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_beastmaster_inner_beast extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = this.Caster !== this.Parent ? "bonus_attack_speed" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
