import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_whisper_of_the_dread extends Modifier {
	protected SetBonusDayVisionAmplifier(
		specialName = "vision_penalty",
		subtract = true
	): void {
		super.SetBonusDayVisionAmplifier(specialName, subtract)
	}
}
