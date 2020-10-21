import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"

@WrapperClass("item_lotus_orb")
export default class item_lotus_orb extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Reflect
	}
}
