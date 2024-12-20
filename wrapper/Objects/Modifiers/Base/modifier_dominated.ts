import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { enchantress_enchant } from "../../Abilities/Enchantress/enchantress_enchant"
import { Modifier } from "../../Base/Modifier"
import { item_helm_of_the_dominator } from "../../Items/item_helm_of_the_dominator"
import { item_helm_of_the_overlord } from "../../Items/item_helm_of_the_overlord"

@WrapperClassModifier()
export class modifier_dominated extends Modifier {
	private cachedArmor = 0
	private cachedDamage = 0
	private cachedHPRegen = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackDamageBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
			this.GetHealthRegenConstant.bind(this)
		]
	])

	protected GetPreAttackDamageBonus(_params?: IModifierParams): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected GetHealthRegenConstant(): [number, boolean] {
		return [this.cachedHPRegen, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof enchantress_enchant) {
			const name = this.Ability.Name
			this.cachedArmor = this.GetSpecialValue("enchant_armor", name)
			this.cachedDamage = this.GetSpecialValue("enchant_damage", name)
		}
		if (
			this.Ability instanceof item_helm_of_the_dominator ||
			this.Ability instanceof item_helm_of_the_overlord
		) {
			const name = this.Ability.Name
			this.cachedArmor = this.GetSpecialValue("creep_bonus_armor", name)
			this.cachedDamage = this.GetSpecialValue("creep_bonus_damage", name)
			this.cachedHPRegen = this.GetSpecialValue("creep_bonus_hp_regen", name)
		}
	}
}
