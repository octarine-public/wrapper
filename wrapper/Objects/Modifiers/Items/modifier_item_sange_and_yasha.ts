import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_sange_and_yasha extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_UNIQUE,
			this.GetSlowResistanceUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
			this.GetMoveSpeedBonusPercentageUnique.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedSpeedResist = 0

	protected GetSlowResistanceUnique(): [number, boolean] {
		return [this.cachedSpeedResist, false]
	}

	protected GetMoveSpeedBonusPercentageUnique(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_sange_and_yasha"
		this.cachedSpeed = this.GetSpecialValue("movement_speed_percent_bonus", name)
		this.cachedSpeedResist = this.GetSpecialValue("slow_resistance", name)
	}
}
