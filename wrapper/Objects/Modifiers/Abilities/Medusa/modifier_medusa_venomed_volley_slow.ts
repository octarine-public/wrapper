import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_venomed_volley_slow extends Modifier {
	private cachedSpeed = 0
	private cachedCastTime = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE,
			this.GetCastTimePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetCastTimePercentage(): [number, boolean] {
		return [-this.cachedCastTime, this.IsMagicImmune()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "medusa_venomed_volley"
		this.cachedSpeed = this.GetSpecialValue("move_slow", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_slow", name)
		this.cachedCastTime = this.GetSpecialValue("cast_slow", name)
	}
}
