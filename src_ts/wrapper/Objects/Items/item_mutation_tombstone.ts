import Item from "../Base/Item"

export default class item_mutation_tombstone extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_Tombstone>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_mutation_tombstone", item_mutation_tombstone)
