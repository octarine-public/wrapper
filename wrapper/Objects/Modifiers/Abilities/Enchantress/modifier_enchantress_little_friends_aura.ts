import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enchantress_little_friends_aura extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
