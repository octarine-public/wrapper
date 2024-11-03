import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { dragon_knight_elder_dragon_form } from "../../../Abilities/DragonKnight/dragon_knight_elder_dragon_form"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_frost_breath_slow extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedResultSpeed = 0

	private get amplifierForm(): number {
		if (this.Caster === undefined) {
			return 1
		}
		const modifier = this.Caster.GetBuffByName("modifier_dragon_knight_dragon_form")
		const abil = modifier?.Ability
		if (
			modifier === undefined ||
			!(abil instanceof dragon_knight_elder_dragon_form)
		) {
			return 1
		}
		const level = !this.Caster.HasScepter
			? abil.Level
			: Math.min(abil.Level + 1, abil.MaxLevel + 1)
		return 1 + abil.GetSpecialValue("frost_breath_effect_bonus", level) / 100
	}

	public PostDataUpdate(): void {
		this.cachedResultSpeed = this.cachedSpeed * this.amplifierForm
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedResultSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"frost_bonus_movement_speed",
			"dragon_knight_dragon_blood"
		)
	}
}
