import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { VambraceAttribute } from "../../../Enums/VambraceAttribute"
import { Modifier } from "../../Base/Modifier"
import { item_vambrace } from "../../Items/item_vambrace"

@WrapperClassModifier()
export class modifier_item_vambrace extends Modifier {
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		const ability = this.Ability as Nullable<item_vambrace>
		if (ability === undefined) {
			return [0, false]
		}
		return ability.ActiveAttribute === VambraceAttribute.AGILITY
			? [this.cachedAttackSpeed, false]
			: [0, false]
	}

	protected UpdateSpecialValues() {
		this.cachedAttackSpeed = this.GetSpecialValue(
			"bonus_attack_speed",
			"item_vambrace"
		)
	}
}
