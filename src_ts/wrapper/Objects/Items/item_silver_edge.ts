import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"

export default class item_silver_edge extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_silver_edge", item_silver_edge)
