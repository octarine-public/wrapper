import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_veil_of_discord_debuff extends Modifier implements IDebuff {
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
	protected UpdateSpecialValues() {
		this.cachedSpellAmplify = this.GetSpecialValue(
			"spell_amp",
			"item_veil_of_discord"
		)
	}
}
