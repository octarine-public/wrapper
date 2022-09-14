import { WrapperClass } from "../../Decorators"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"
import { Item } from "../Base/Item"

@WrapperClass("item_lotus_orb")
export class item_lotus_orb extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Reflect
	}
}
