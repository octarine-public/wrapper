import Item from "../Base/Item"

export default class item_black_king_bar extends Item {
	public static AppliesUnitState: modifierstate = modifierstate.MODIFIER_STATE_MAGIC_IMMUNE
	public static ModifierName: string = "modifier_black_king_bar_immune"}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_black_king_bar", item_black_king_bar)
