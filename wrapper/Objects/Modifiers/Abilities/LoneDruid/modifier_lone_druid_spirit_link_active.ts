import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lone_druid_spirit_link_active extends Modifier {
	private cachedAttackSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "lone_druid_spirit_link"
		const attackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		const activeBbonus = this.GetSpecialValue("active_bonus", name) / 100
		this.cachedAttackSpeed = attackSpeed * activeBbonus
	}
}
