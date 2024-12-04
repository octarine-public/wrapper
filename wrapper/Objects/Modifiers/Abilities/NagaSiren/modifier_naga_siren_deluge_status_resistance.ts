import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_naga_siren_deluge_status_resistance extends Modifier {
	private cachedSpeed = 0
	private cachedStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX,
			this.GetMoveSpeedAbsoluteMax.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	protected GetMoveSpeedAbsoluteMax(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedStatusResist, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "naga_siren_deluge"
		this.cachedSpeed = this.GetSpecialValue("max_movement_speed", name)
		this.cachedStatusResist = this.GetSpecialValue("status_resistance", name)
	}
}
