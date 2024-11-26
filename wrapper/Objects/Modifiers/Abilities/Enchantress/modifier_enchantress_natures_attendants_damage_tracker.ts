import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enchantress_natures_attendants_damage_tracker extends Modifier {
	private cachedMS = 0
	private cachedSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedMS = 0
			return
		}
		if (this.StackCount !== 0) {
			this.cachedMS = this.cachedSpeed
			return
		}
		const hasBuff = owner.HasBuffByName("modifier_enchantress_natures_attendants")
		this.cachedMS = hasBuff ? this.cachedSpeed : 0
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedMS, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"movespeed",
			"enchantress_natures_attendants"
		)
	}
}
