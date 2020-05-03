import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"

export default class item_invis_sword extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_invis_sword", item_invis_sword)
