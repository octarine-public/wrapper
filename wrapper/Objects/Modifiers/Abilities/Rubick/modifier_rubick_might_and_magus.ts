import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_might_and_magus extends Modifier {
	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	private get spellAmps(): number {
		const caster = this.Caster
		if (caster === undefined) {
			return 0
		}
		const percenate = caster.ModifierManager.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			false,
			1,
			1
		)
		const percenateUnique = caster.ModifierManager.GetConstantHighestInternal(
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE
		)
		return percenate + percenateUnique
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.spellAmps * (this.cachedMres / 100), this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMres = this.GetSpecialValue(
			"magic_resist_pct",
			"rubick_might_and_magus"
		)
	}
}
