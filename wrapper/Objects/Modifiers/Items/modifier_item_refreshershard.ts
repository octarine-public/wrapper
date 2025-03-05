import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_refreshershard extends Modifier {
	private cachedBonusDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedBonusDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBonusDamage = this.GetSpecialValue(
			"bonus_damage",
			"item_refresher_shard"
		)
	}
}
