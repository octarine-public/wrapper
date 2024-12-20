import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { VambraceAttribute } from "../../../Enums/VambraceAttribute"
import { Modifier } from "../../Base/Modifier"
import { item_vambrace } from "../../Items/item_vambrace"

@WrapperClassModifier()
export class modifier_item_vambrace extends Modifier {
	private cachedMres = 0
	private cachedAttackSpeed = 0
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetSpellAmplifyPercentage(): [number, boolean] {
		const ability = this.Ability as Nullable<item_vambrace>
		if (ability === undefined) {
			return [0, false]
		}
		return ability.ActiveAttribute === VambraceAttribute.INTELLIGENCE
			? [this.cachedSpellAmplify, false]
			: [0, false]
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		const ability = this.Ability as Nullable<item_vambrace>
		if (ability === undefined) {
			return [0, false]
		}
		return ability.ActiveAttribute === VambraceAttribute.STRENGTH
			? [this.cachedMres, false]
			: [0, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		const ability = this.Ability as Nullable<item_vambrace>
		if (ability === undefined) {
			return [0, false]
		}
		return ability.ActiveAttribute === VambraceAttribute.AGILITY
			? [this.cachedAttackSpeed, false]
			: [0, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_vambrace"
		this.cachedMres = this.GetSpecialValue("bonus_magic_resistance", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		this.cachedSpellAmplify = this.GetSpecialValue("bonus_spell_amp", name)
	}
}
