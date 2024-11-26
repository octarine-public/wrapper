import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_witch_doctor_death_ward_switcheroo_attackspeed_reduction extends Modifier {
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues() {
		this.cachedAttackSpeed = this.GetSpecialValue(
			"attack_speed_reduction",
			"witch_doctor_voodoo_switcheroo"
		)
	}
}
