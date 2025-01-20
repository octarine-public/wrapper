import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_naga_siren_reel_in extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
