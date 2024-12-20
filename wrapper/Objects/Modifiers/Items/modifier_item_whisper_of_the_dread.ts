import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_whisper_of_the_dread extends Modifier {
	private cachedDayVision = 0
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentageUnique.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION_PERCENTAGE,
			this.GetBonusDayVisionPercentage.bind(this)
		]
	])

	protected GetSpellAmplifyPercentageUnique(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}

	protected GetBonusDayVisionPercentage(): [number, boolean] {
		return [-this.cachedDayVision, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "item_whisper_of_the_dread"
		this.cachedDayVision = this.GetSpecialValue("vision_penalty", name)
		this.cachedSpellAmplify = this.GetSpecialValue("bonus_spell_damage", name)
	}
}
