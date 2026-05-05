import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_keeper_of_the_light_bright_speed extends Modifier {
	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetBonusMovementSpeed.bind(this)
		]
	])
	public GetBonusMovementSpeed(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || this.cachedSpeed <= 0) {
			return [0, false]
		}
		return [owner.TotalIntellect / this.cachedSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"intelligence_per_speed",
			"keeper_of_the_light_bright_speed"
		)
	}
}
