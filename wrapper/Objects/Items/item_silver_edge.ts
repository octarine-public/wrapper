import { WrapperClass } from "../../Decorators"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import Item from "../Base/Item"

@WrapperClass("item_silver_edge")
export default class item_silver_edge extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
