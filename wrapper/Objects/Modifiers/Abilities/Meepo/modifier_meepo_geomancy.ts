import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_meepo_geomancy extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.NetworkChannelTime, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		// only debug
		this.GetSpecialValue("dirt_move_speed", "meepo_geomancy")
	}
}
