import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_gravekeepers_cloak extends Modifier {
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
		const caster = this.Caster
		if (caster === undefined) {
			this.cachedArmor = 0
			return
		}
		this.cachedArmor =
			caster
				.GetAbilityByName("special_bonus_unique_visage_5")
				?.GetSpecialValue("value") ?? 0
	}
}
