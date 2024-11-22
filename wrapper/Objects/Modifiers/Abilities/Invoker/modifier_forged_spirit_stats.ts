import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_forge_spirit } from "../../../Abilities/Invoker/invoker_forge_spirit"
import { invoker_forge_spirit_ad } from "../../../Abilities/Invoker/invoker_forge_spirit_ad"
import { Ability } from "../../../Base/Ability"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_forged_spirit_stats extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue()
	}

	protected GetSpecialValue(
		specialName = "spirit_attack_range",
		abilityName = "invoker_forge_spirit",
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
	): number {
		const ability = this.Ability
		if (!this.ShouldBeValidSpell(ability)) {
			return 0
		}
		return super.GetSpecialValue(
			specialName,
			abilityName,
			Math.max(ability.QuasLevel + level, level) // quas level
		)
	}

	protected ShouldBeValidSpell(
		ability: Nullable<Ability>
	): ability is invoker_forge_spirit | invoker_forge_spirit_ad {
		return (
			ability instanceof invoker_forge_spirit ||
			ability instanceof invoker_forge_spirit_ad
		)
	}
}
