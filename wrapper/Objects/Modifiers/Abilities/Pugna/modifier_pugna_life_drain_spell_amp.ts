import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_pugna_life_drain_spell_amp extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return this.Caster !== this.Parent
			? [-this.StackCount, this.IsMagicImmune()]
			: [this.StackCount, false]
	}
}
