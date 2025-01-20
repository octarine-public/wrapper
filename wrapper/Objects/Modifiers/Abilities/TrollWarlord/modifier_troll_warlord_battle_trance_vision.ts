import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_battle_trance_vision extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
