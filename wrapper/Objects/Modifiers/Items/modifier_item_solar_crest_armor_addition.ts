import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
@WrapperClassModifier()
export class modifier_item_solar_crest_armor_addition extends Modifier {
	protected SetBonusArmor(
		specialName = this.isTarget() ? "target_armor" : undefined,
		subtract = false
	): void {
		super.SetBonusArmor(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = this.isTarget() ? "target_attack_speed" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetBonusMoveSpeed(
		specialName = this.isTarget() ? "target_movement_speed" : undefined,
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}

	private isTarget(): boolean {
		return this.Caster !== this.Parent
	}
}
