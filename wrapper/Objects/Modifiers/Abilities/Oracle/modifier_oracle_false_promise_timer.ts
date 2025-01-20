import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_false_promise_timer extends Modifier {
	public readonly IsHidden = false
	public get ForceVisible(): boolean {
		return true
	}
}
