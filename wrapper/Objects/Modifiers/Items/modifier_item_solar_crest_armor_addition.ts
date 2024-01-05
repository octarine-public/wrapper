import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
@WrapperClassModifier()
export class modifier_item_solar_crest extends Modifier {
	public readonly IsBuff = true
	public readonly IsDebuff = false

	protected SetBonusMoveSpeed(
		specialName = this.Caster !== this.Parent ? "target_movement_speed" : undefined,
		subtract = false
	): void {
		super.SetBonusMoveSpeed(specialName, subtract)
	}
}
