import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_templar_assassin_psionic_trap_counter extends Modifier {
	public get ForceVisible(): boolean {
		return this.StackCount !== 0
	}
}
