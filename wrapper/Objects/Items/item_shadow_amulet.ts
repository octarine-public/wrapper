import { WrapperClass } from "../../Decorators"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { Item } from "../Base/Item"

@WrapperClass("item_shadow_amulet")
export class item_shadow_amulet extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
