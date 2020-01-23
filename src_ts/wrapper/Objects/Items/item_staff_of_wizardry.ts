import Item from "../Base/Item"

export default class item_staff_of_wizardry extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_StaffOfWizardry>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_staff_of_wizardry", item_staff_of_wizardry)
