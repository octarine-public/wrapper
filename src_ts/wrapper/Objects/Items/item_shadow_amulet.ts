import Item from "../Base/Item"
import { AbilityLogicType } from "../../Enums/AbilityLogicType"

export default class item_shadow_amulet extends Item {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_shadow_amulet", item_shadow_amulet)
