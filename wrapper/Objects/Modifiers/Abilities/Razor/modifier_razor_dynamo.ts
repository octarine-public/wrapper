import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_razor_dynamo extends Modifier {
	private cachedSpellAmplifyDivisor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const maxDamage = owner.GetAttackDamageBonus(owner.AttackDamageMax)
		return [Math.floor(maxDamage / this.cachedSpellAmplifyDivisor), false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpellAmplifyDivisor = this.GetSpecialValue(
			"spell_amp_damage_divisor",
			"razor_dynamo"
		)
	}
}
