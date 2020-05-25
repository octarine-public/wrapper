import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_invis_sword")
export default class item_invis_sword extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
