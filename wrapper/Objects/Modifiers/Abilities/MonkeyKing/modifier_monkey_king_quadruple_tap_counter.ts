import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_monkey_king_quadruple_tap_counter extends Modifier {
	public get ForceVisible(): boolean {
		return this.StackCount !== 0
	}
}
