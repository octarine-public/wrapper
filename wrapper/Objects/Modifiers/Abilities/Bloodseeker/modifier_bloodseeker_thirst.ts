import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_thirst extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

	private minBonus = 0
	private maxBonus = 0
	private bonusSpeed = 0
	private activeBonusSpeed = 0
	private cachedTotalSpeed = 0
	private cachedInactivePenalty = 0

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
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public PostDataUpdate(): void {
		const owner = this.Parent,
			min = this.minBonus,
			max = this.maxBonus,
			abil = this.Ability
		if (owner === undefined || abil === undefined) {
			this.cachedTotalSpeed = 0
			return
		}
		if (min === max || owner.IsPassiveDisabled) {
			this.cachedTotalSpeed = 0
			return
		}
		let value = this.bonusSpeed
		const hasBonus = owner.HasBuffByName("modifier_bloodseeker_thirst_active")
		if (hasBonus) {
			value += this.activeBonusSpeed
		} else if (this.cachedInactivePenalty !== 0 && !abil.IsCooldownReady) {
			value = value * ((100 - this.cachedInactivePenalty) / 100)
		}
		this.cachedTotalSpeed = (this.InternalStackCount * value) / (min - max)
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
		this.cachedInactivePenalty = this.GetSpecialValue("inactive_penalty_pct", name)
	}
}
