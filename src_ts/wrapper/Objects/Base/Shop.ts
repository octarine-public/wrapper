import Building from "./Building"

export default class Shop extends Building {
	public readonly m_pBaseEntity!: C_DOTA_BaseNPC_Shop

	get ShopType(): DOTA_SHOP_TYPE {
		return this.m_pBaseEntity.m_ShopType
	}
	get IsShop(): boolean {
		return true
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_BaseNPC_Shop", Shop)
