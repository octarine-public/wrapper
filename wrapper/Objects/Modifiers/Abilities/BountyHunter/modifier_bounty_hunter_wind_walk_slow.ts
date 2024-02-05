import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bounty_hunter_wind_walk_slow extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusAttackSpeed(specialName = "attack_slow", subtract = true): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
