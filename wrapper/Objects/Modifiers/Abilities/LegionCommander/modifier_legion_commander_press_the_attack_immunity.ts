import { BaseMagicImmunityResist } from "../../../../Data/GameData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_legion_commander_press_the_attack_immunity extends Modifier {
	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres !== 0 ? BaseMagicImmunityResist : 0, false]
	}

	protected UpdateSpecialValues() {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const abil = owner.GetAbilityByName("special_bonus_unique_legion_commander_8")
		this.cachedMres = abil?.GetSpecialValue("value") ?? 0
	}
}
