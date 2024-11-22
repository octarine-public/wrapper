import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phantom_lancer_phantom_edge_boost extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE,
			this.GetMoveSpeedAbsolute.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetAttackRangeBonus(): [number, boolean] {
		return [-70, false] // no special values
	}

	protected GetMoveSpeedAbsolute(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"bonus_speed",
			"phantom_lancer_phantom_edge"
		)
	}
}
