import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_orb_of_corrosion extends Modifier {
	private cachedPreArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_PHYSICAL_ARMOR_BONUS_TARGET,
			this.GetPreAttackPhysicalArmorBonusTarget.bind(this)
		]
	])
	protected GetPreAttackPhysicalArmorBonusTarget(
		params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined || owner.IsIllusion) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (
			target === undefined ||
			target.IsDebuffImmune ||
			target.HasBuffByName("modifier_orb_of_corrosion_debuff")
		) {
			return [0, false]
		}
		return [this.cachedPreArmor, false]
	}
	protected UpdateSpecialValues() {
		this.cachedPreArmor = this.GetSpecialValue(
			"corruption_armor",
			"item_orb_of_corrosion"
		)
	}
}
