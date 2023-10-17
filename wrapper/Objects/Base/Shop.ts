import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTA_SHOP_TYPE } from "../../Enums/DOTA_SHOP_TYPE"
import { EPropertyType } from "../../Enums/PropertyType"
import { Building } from "./Building"

@WrapperClass("CDOTA_BaseNPC_Shop")
export class Shop extends Building {
	/**
	 * @readonly
	 * @description Represents the type of the shop.
	 */
	@NetworkedBasicField("m_ShopType", EPropertyType.UINT32)
	public ShopType: DOTA_SHOP_TYPE = DOTA_SHOP_TYPE.DOTA_SHOP_NONE

	/** @ignore */
	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsShop = true
	}
}
