import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_ghoul_frenzy extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsPassiveDisabled()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "life_stealer_ghoul_frenzy"
		this.cachedSpeed = this.GetSpecialValue("movement_speed_bonus", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_bonus", name)
	}
}
