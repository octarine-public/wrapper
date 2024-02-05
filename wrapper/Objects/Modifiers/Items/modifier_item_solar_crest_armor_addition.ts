import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
@WrapperClassModifier()
export class modifier_item_solar_crest_armor_addition extends Modifier {
	public readonly IsBuff = true
	public readonly IsDebuff = false

	protected SetBonusAttackSpeed(
		specialName = this.Caster !== this.Parent ? "target_attack_speed" : undefined,
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected SetBonusMoveSpeed(
		specialName = this.Caster !== this.Parent ? "target_movement_speed" : undefined,
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
