import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry_passive extends Modifier {
	protected SetBonusArmor(specialName = "shard_passive_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}

	public SetMoveSpeedAmplifier(
		specialName = "shard_passive_movespeed",
		subtract = false
	): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
