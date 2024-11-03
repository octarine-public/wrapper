import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { nyx_assassin_vendetta } from "../../../Abilities/NyxAssassin/nyx_assassin_vendetta"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nyx_assassin_vendetta extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private ms = 0
	private msBonus = 0

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = this.ms
			return
		}
		const modifier = owner.GetBuffByName("modifier_nyx_assassin_vendetta_fast"),
			ability = modifier?.Ability
		if (modifier === undefined || !(ability instanceof nyx_assassin_vendetta)) {
			this.cachedSpeed = this.ms
			return
		}
		this.cachedSpeed = this.ms + this.msBonus
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "nyx_assassin_vendetta"
		this.ms = this.GetSpecialValue("movement_speed", name)
		this.msBonus = this.GetSpecialValue("free_pathing_movement_speed_bonus", name)
	}
}
