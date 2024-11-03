import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ringmaster_the_box_buff extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedSlowResist = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected GetSlowResistanceStacking(): [number, boolean] {
		return [this.cachedSlowResist, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "ringmaster_the_box"
		this.cachedSpeed = this.GetSpecialValue("move_speed", name)
		this.cachedSlowResist = this.GetSpecialValue("slow_resist", name)
	}
}
