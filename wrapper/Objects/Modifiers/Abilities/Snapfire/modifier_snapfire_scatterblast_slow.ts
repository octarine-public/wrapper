import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_snapfire_scatterblast_slow extends Modifier {
	private cachedSpeed = 0
	private cachedBonus = 0
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
		let value = this.cachedSpeed
		if (this.NetworkIsActive) {
			value += this.cachedBonus
		}
		return [-value, this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		let value = this.cachedAttackSpeed
		if (this.NetworkIsActive) {
			value += this.cachedBonus
		}
		return [-value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "snapfire_scatterblast"
		this.cachedSpeed = this.GetSpecialValue("movement_slow_pct", name)
		this.cachedBonus = this.GetSpecialValue("point_blank_dmg_bonus_pct", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_slow_pct", name)
	}
}
