import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_dragon_blood extends Modifier {
	private cachedArmor = 0
	private cachedMultiplier = 1
	private cachedIsForm = false

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public PostDataUpdate(): void {
		const owner = this.Caster
		if (owner === undefined) {
			this.cachedIsForm = false
			return
		}
		this.cachedIsForm = owner.HasBuffByName("modifier_dragon_knight_dragon_form")
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		const armor = this.cachedArmor,
			multiplier = this.cachedIsForm ? this.cachedMultiplier : 1
		return [armor + (armor * multiplier) / 100, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		const name = "dragon_knight_dragon_blood"
		this.cachedArmor = this.GetSpecialValue(
			"armor",
			name,
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1),
			{ lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD } }
		)
		this.cachedMultiplier = this.GetSpecialValue(
			"regen_and_armor_multiplier_during_dragon_form",
			name
		)
	}
}
