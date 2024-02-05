import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lone_druid_spirit_link_active extends Modifier {
	protected SetBonusAttackSpeed(_specialName?: string, _subtract = false): void {
		const attackSpeed = this.GetSpecialValue("bonus_attack_speed")
		const activeBbonus = this.GetSpecialValue("active_bonus") / 100
		this.BonusAttackSpeed = attackSpeed * activeBbonus
	}
}
