import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enraged_wildkin_toughness_aura_bonus extends Modifier {
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, this.IsPassiveDisabled(this.Caster)]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue(
			"bonus_armor",
			"enraged_wildkin_toughness_aura"
		)
	}
}
