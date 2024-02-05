import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_storm_spirit_electric_rave extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "shard_attack_speed_bonus",
		subtract = false
	): void {
		if (!this.Caster?.HasShard) {
			this.BonusAttackSpeed = 0
			return
		}
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
