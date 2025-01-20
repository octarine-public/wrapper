import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sniper_assassinate extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
