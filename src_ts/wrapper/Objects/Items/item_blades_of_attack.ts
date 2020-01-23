import Item from "../Base/Item"

export default class item_blades_of_attack extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_BladesOfAttack>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_blades_of_attack", item_blades_of_attack)
