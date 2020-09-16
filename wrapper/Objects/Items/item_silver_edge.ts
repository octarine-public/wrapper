import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_silver_edge")
export default class item_silver_edge extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
