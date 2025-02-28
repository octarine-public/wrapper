import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_gunpowder_gauntlets extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])

	protected GetProcAttackBonusDamageMagical(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues() {
		this.cachedDamage = this.GetSpecialValue(
			"bonus_damage",
			"item_gunpowder_gauntlets"
		)
	}
}
