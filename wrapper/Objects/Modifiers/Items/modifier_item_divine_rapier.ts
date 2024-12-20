import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_divine_rapier extends Modifier {
	private cachedBonusDamage = 0
	private cachedBaseBonusDamage = 0

	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		let value = this.cachedBaseBonusDamage
		if (!(this.Ability?.IsToggled ?? false)) {
			value += this.cachedBonusDamage
		}
		return [value, false]
	}

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return (this.Ability?.IsToggled ?? false)
			? [this.cachedSpellAmplify, false]
			: [0, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_divine_rapier"
		this.cachedBonusDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedSpellAmplify = this.GetSpecialValue("bonus_spell_amp", name)
		this.cachedBaseBonusDamage = this.GetSpecialValue("bonus_damage_base", name)
	}
}
