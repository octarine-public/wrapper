import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phantom_assassin_coup_counter extends Modifier {
	public get ForceVisible(): boolean {
		return this.StackCount !== 0
	}
}
