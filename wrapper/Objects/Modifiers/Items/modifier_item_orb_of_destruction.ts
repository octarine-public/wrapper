import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_orb_of_destruction extends Modifier {
	private cachedArmor = 0

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
		const name = "modifier_orb_of_destruction_debuff"
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.HasBuffByName(name)) {
			return [0, false]
		}
		return [-this.cachedArmor, target.IsMagicImmune || target.IsDebuffImmune]
	}

	protected UpdateSpecialValues(): void {
		this.cachedArmor = this.GetSpecialValue(
			"armor_reduction",
			"item_orb_of_destruction"
		)
	}
}
