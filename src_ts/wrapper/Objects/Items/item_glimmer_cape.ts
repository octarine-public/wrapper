import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_glimmer_cape")
export default class item_glimmer_cape extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
