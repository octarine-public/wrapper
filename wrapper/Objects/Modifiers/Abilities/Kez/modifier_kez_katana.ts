import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { kez_switch_weapons } from "../../../Abilities/Kez/kez_switch_weapons"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_katana extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE,
			this.GetAttackBaseOverride.bind(this)
		]
	])

	private cachedRange = 0

	protected GetAttackBaseOverride(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected UpdateSpecialValues(): void {
		if (this.Ability instanceof kez_switch_weapons) {
			this.cachedRange = this.GetSpecialValue(
				"katana_attack_range",
				this.Ability.Name
			)
		}
	}
}
