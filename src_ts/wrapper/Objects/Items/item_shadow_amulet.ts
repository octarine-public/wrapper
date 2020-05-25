import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_shadow_amulet")
export default class item_shadow_amulet extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
