import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_sai extends Modifier {
	public OnAbilityHiddenChanged(): void {
		const ability = this.Ability
		if (ability === undefined || ability.IsHidden) {
			this.FixedAttackRange = 0
			this.FixedBaseAttackTime = 0
			return
		}
		this.SetFixedAttackRange()
		this.SetFixedBaseAttackTime()
	}

	protected SetFixedAttackRange(
		specialName = "sai_attack_range",
		subtract = false
	): void {
		super.SetFixedAttackRange(specialName, subtract)
	}

	protected SetFixedBaseAttackTime(
		specialName = "sai_base_attack_time",
		subtract = false
	): void {
		super.SetFixedBaseAttackTime(specialName, subtract)
	}
}
