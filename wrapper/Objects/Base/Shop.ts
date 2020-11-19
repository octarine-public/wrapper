import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import Building from "./Building"

@WrapperClass("C_DOTA_BaseNPC_Shop")
export default class Shop extends Building {
	@NetworkedBasicField("m_ShopType")
	public ShopType = DOTA_SHOP_TYPE.DOTA_SHOP_NONE
}
