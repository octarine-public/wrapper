import { WrapperClass } from "../../Decorators"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import Item from "../Base/Item"

@WrapperClass("item_invis_sword")
export default class item_invis_sword extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}
