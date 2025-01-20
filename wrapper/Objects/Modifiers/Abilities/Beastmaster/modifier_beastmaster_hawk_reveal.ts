import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_beastmaster_hawk_reveal extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
