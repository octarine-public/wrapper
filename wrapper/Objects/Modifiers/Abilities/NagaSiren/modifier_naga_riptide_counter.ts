import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_naga_riptide_counter extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
