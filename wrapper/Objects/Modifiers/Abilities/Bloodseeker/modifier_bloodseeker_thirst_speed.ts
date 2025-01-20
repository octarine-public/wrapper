import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bloodseeker_thirst_speed extends Modifier {
	public readonly IsHidden = false
	public get ForceVisible(): boolean {
		return true
	}
}
