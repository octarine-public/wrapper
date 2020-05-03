import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"

export default class item_glimmer_cape extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_glimmer_cape", item_glimmer_cape)
