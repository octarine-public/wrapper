import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_leshrac_diabolic_edict extends Modifier {
	public readonly IsHidden = false
	public get ForceVisible(): boolean {
		return true
	}
}
