import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_grimstroke_soul_chain extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_TARGET,
			this.GetSpellAmplifyPercentageTarget.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetSpellAmplifyPercentageTarget(): [number, boolean] {
		return [this.cachedSpellAmplify, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpellAmplify = this.GetSpecialValue(
			"bonus_reflected_spell_damage",
			"grimstroke_soul_chain"
		)
	}
}
