import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_dragon_blood extends Modifier {
	private cachedArmor = 0
	private cachedMultiplier = 1

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	protected GetPhysicalArmorBonus(): [number, boolean] {
		const caster = this.Caster
		if (caster === undefined) {
			return [0, false]
		}
		const armor = this.cachedArmor,
			isForm = caster.HasBuffByName("modifier_dragon_knight_dragon_form"),
			multiplier = isForm ? this.cachedMultiplier : 1
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
