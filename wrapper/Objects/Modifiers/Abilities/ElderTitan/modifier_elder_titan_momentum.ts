import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_momentum extends Modifier {
	private cachedPenalty = 0
	private cachedSpeedFromMS = 0
	private cachedAttackSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedAttackSpeed = 0
			return
		}
		const eff = owner.MoveSpeed * (this.cachedSpeedFromMS / 100)
		this.cachedAttackSpeed = eff - this.cachedPenalty
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "elder_titan_momentum"
		this.cachedPenalty = this.GetSpecialValue("attack_speed_penalty", name)
		this.cachedSpeedFromMS = this.GetSpecialValue("attack_speed_from_movespeed", name)
	}
}
