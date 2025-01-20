import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tusk_snowball_target extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
