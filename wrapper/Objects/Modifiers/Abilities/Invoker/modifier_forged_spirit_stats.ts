import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_spell_extends } from "../../../Abilities/Invoker/invoker_spell_extends"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_forged_spirit_stats extends Modifier {
	private cachedRange = 0
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor - 2, false] // -2 hardcoded by Valve
	}

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue("spirit_armor")
		this.cachedRange = this.GetSpecialValue("spirit_attack_range")
	}

	protected GetSpecialValue(
		specialName: string,
		abilityName = "invoker_forge_spirit",
		_level?: number
	): number {
		const ability = this.Ability
		if (!(ability instanceof invoker_spell_extends)) {
			return 0
		}
		switch (specialName) {
			case "spirit_armor":
				return super.GetSpecialValue(specialName, abilityName, ability.ExortLevel)
			case "spirit_attack_range":
				return super.GetSpecialValue(specialName, abilityName, ability.QuasLevel)
			default:
				return 0
		}
	}
}
