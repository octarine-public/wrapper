import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_false_promise extends Modifier {
	protected SetBonusBaseAttackTime(
		specialName = "shard_bat_bonus",
		subtract = true
	): void {
		if (!this.Parent?.HasScepter) {
			this.BonusBaseAttackTime = 0
			return
		}
		super.SetBonusBaseAttackTime(specialName, subtract)
	}
}
