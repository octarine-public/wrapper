import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_abyssal_blade")
export default class item_abyssal_blade extends Item {
	public static readonly AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_STUNNED
}
