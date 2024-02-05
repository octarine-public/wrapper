import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_marci_unleash_flurry extends Modifier {
	public readonly IsAttackSpeedLimit = false

	public SetBonusAttackSpeed(
		specialName = "flurry_bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
