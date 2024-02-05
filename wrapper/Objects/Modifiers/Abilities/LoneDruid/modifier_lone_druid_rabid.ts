import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lone_druid_rabid extends Modifier {
	protected SetBonusAttackSpeed(
		specialName = "shard_attack_speed",
		subtract = false
	): void {
		if (!this.Caster?.HasShard) {
			this.BonusAttackSpeed = 0
			return
		}
		super.SetBonusAttackSpeed(specialName, subtract)
	}
}
