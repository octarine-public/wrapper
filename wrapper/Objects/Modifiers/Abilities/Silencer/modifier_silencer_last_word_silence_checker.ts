import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_silencer_last_word_silence_checker extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedSpeed = this.GetSpecialValue("slow_per_silence", "silencer_last_word")
	}
}