import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lich_sinister_gaze extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX,
			this.GetMoveSpeedAbsoluteMax.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedAbsoluteMax(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const caster = this.Caster,
			owner = this.Parent
		if (caster === undefined || owner === undefined) {
			return
		}
		const destination = this.GetSpecialValue("destination", "lich_sinister_gaze")
		const distance = caster.Distance2D(owner.Position)
		this.cachedSpeed = Math.floor((distance * destination) / 100 / this.Duration)
	}
}
