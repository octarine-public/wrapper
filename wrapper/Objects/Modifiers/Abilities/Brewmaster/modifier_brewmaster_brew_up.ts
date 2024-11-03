import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_brew_up extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedMinSpeed = 0
	private cachedMaxSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const time = Math.ceil(this.RemainingTime)
		return [time % 2 === 1 ? this.cachedMaxSpeed : this.cachedMinSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "brewmaster_cinder_brew"
		this.cachedMinSpeed = this.GetSpecialValue("min_movement", name)
		this.cachedMaxSpeed = this.GetSpecialValue("max_movement", name)
	}
}
