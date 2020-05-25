import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_black_king_bar")
export default class item_black_king_bar extends Item {
	public static AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_MAGIC_IMMUNE
	public static ModifierName: string = "modifier_black_king_bar_immune"
}
