import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_spell_extends } from "../../../Abilities/Invoker/invoker_spell_extends"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_forged_spirit_stats extends Modifier {
	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue()
	}

	protected GetSpecialValue(
		specialName = "spirit_attack_range",
		abilityName = "invoker_forge_spirit",
		_level?: number
	): number {
		const ability = this.Ability
		if (!(ability instanceof invoker_spell_extends)) {
			return 0
		}
		return super.GetSpecialValue(specialName, abilityName, ability.QuasLevel)
	}
}
