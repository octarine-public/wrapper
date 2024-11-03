import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_time_zone_effect extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent
		const caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		const isEnemy = owner.IsEnemy(caster),
			value = isEnemy ? -this.cachedSpeed : this.cachedSpeed
		return [value, false] // isEnemy && this.IsMagicImmune()
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"bonus_move_speed",
			"faceless_void_time_zone"
		)
	}
}
