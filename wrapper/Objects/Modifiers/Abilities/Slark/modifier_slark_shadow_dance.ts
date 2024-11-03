import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slark_shadow_dance extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	public PostDataUpdate(): void {
		this.UpdateSpecialValues()
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const modifier = owner.GetBuffByName("modifier_slark_shadow_dance_passive_regen")
		if (modifier !== undefined || owner.IsPassiveDisabled) {
			this.cachedSpeed = 0
			return
		}
		const abil = owner.GetAbilityByName("slark_barracuda")
		if (abil === undefined || abil.Level === 0) {
			this.cachedSpeed = 0
			return
		}
		this.cachedSpeed = abil.GetSpecialValue("bonus_movement_speed")
	}
}
