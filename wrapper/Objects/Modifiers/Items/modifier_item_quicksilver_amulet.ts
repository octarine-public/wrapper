import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_quicksilver_amulet extends Modifier {
	private cachedSpeed = 0
	private cachedSpeedBonus = 0

	private cachedAttackSpeed = 0
	private cachedAttackSpeedBonus = 0

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
		const bonus = this.cachedSpeedBonus * this.StackCount
		return [this.cachedSpeed + bonus, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		const bonus = this.cachedAttackSpeedBonus * this.StackCount
		return [this.cachedAttackSpeed + bonus, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_quicksilver_amulet"
		this.cachedSpeed = this.GetSpecialValue("base_movement", name)
		this.cachedSpeedBonus = this.GetSpecialValue("bonus_movement", name)
		this.cachedAttackSpeed = this.GetSpecialValue("base_attack", name)
		this.cachedAttackSpeedBonus = this.GetSpecialValue("bonus_attack", name)
	}
}
