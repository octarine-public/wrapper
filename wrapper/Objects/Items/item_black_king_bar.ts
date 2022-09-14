import { WrapperClass } from "../../Decorators"
import { modifierstate } from "../../Enums/modifierstate"
import { Item } from "../Base/Item"

@WrapperClass("item_black_king_bar")
export class item_black_king_bar extends Item {
	public static AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_MAGIC_IMMUNE
	public static ModifierName: string = "modifier_black_king_bar_immune"
}
