import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_thirst extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT,
			this.GetIgnoreMoveSpeedLimit.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private minBonus = 0
	private maxBonus = 0
	private bonusSpeed = 0
	private activeBonusSpeed = 0
	private cachedTotalSpeed = 0

	public PostDataUpdate(): void {
		const owner = this.Parent,
			min = this.minBonus,
			max = this.maxBonus
		if (owner === undefined || min === max || owner.IsPassiveDisabled) {
			this.cachedTotalSpeed = 0
			return
		}
		let value = this.bonusSpeed
		if (owner.HasBuffByName("modifier_bloodseeker_thirst_active")) {
			value += this.activeBonusSpeed
		}
		this.cachedTotalSpeed = (this.StackCount * value) / (min - max)
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedTotalSpeed, false]
	}

	protected GetIgnoreMoveSpeedLimit(): [number, boolean] {
		return [1, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "bloodseeker_thirst"
		this.minBonus = this.GetSpecialValue("min_bonus_pct", name)
		this.maxBonus = this.GetSpecialValue("max_bonus_pct", name)
		this.bonusSpeed = this.GetSpecialValue("bonus_movement_speed", name)
		this.activeBonusSpeed = this.GetSpecialValue("active_movement_speed", name)
	}
}
