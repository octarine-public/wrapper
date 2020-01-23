import Item from "../Base/Item"

export default class item_ogre_axe extends Item {
	public NativeEntity: Nullable<C_DOTA_Item_OgreAxe>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("item_ogre_axe", item_ogre_axe)
