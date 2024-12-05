import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { enchantress_enchant } from "../../Abilities/Enchantress/enchantress_enchant"
import { Modifier } from "../../Base/Modifier"
import { item_helm_of_the_dominator } from "../../Items/item_helm_of_the_dominator"
import { item_helm_of_the_overlord } from "../../Items/item_helm_of_the_overlord"

@WrapperClassModifier()
export class modifier_dominated extends Modifier {
	private cachedArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof enchantress_enchant) {
			this.cachedArmor = this.GetSpecialValue("enchant_armor", this.Ability.Name)
		}
		if (
			this.Ability instanceof item_helm_of_the_dominator ||
			this.Ability instanceof item_helm_of_the_overlord
		) {
			this.cachedArmor = this.GetSpecialValue(
				"creep_bonus_armor",
				this.Ability.Name
			)
		}
	}
}
