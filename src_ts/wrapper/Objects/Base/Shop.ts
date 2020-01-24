import Building from "./Building"

export default class Shop extends Building {
	public NativeEntity: Nullable<C_DOTA_BaseNPC_Shop>
	public ShopType = DOTA_SHOP_TYPE.DOTA_SHOP_NONE
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Shop", Shop)
RegisterFieldHandler(Shop, "m_ShopType", (shop, new_val) => shop.ShopType = new_val as DOTA_SHOP_TYPE)
