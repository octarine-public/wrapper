import Building from "./Building"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTA_BaseNPC_Shop")
export default class Shop extends Building {
	@NetworkedBasicField("m_ShopType")
	public ShopType = DOTA_SHOP_TYPE.DOTA_SHOP_NONE
}
