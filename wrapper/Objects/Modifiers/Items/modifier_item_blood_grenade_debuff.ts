import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_blood_grenade_debuff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const value = this.NetworkDamage !== 0 ? this.NetworkDamage : this.cachedSpeed
		return [value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue("movespeed_slow", "item_blood_grenade")
	}
}
