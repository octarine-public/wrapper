import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_antimage_mana_thirst_vision extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
