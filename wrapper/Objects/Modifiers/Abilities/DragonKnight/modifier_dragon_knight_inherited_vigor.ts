import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_inherited_vigor extends Modifier {
	private cachedArmor = 0
	private cachedArmorBase = 0
	private cachedPerLevelArmor = 0
	private cachedPerLevelArmorForm = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedArmor = 0
			return
		}
		let additionalForm = 1
		if (owner.HasBuffByName("modifier_dragon_knight_dragon_form")) {
			additionalForm = this.cachedPerLevelArmorForm
		}
		const level = owner.Level,
			multiply = this.cachedPerLevelArmor * level
		this.cachedArmor = (this.cachedArmorBase + multiply) * additionalForm
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "dragon_knight_inherited_vigor"
		this.cachedArmorBase = this.GetSpecialValue("base_armor", name)
		this.cachedPerLevelArmor = this.GetSpecialValue("level_mult", name)
		this.cachedPerLevelArmorForm = this.GetSpecialValue(
			"regen_and_armor_multiplier_during_dragon_form",
			name
		)
	}
}
