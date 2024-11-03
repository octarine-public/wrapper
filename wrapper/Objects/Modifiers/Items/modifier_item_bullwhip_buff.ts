import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_bullwhip_buff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const isEnemy = this.Parent?.IsEnemy(this.Caster) ?? false
		const value = isEnemy ? -this.cachedSpeed : this.cachedSpeed
		return [value, isEnemy ? this.IsMagicImmune() : false]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue("speed", "item_bullwhip")
	}
}
