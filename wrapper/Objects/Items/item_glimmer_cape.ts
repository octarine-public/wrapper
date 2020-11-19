import { WrapperClass } from "../../Decorators"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import Item from "../Base/Item"

@WrapperClass("item_glimmer_cape")
export default class item_glimmer_cape extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
