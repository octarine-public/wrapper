import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_morphling_waveform extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
