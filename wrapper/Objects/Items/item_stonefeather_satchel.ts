import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { EStoneFeatherAttribute } from "../../Enums/EStoneFeather"
import { Item } from "../Base/Item"

@WrapperClass("item_stonefeather_satchel")
export class item_stonefeather_satchel extends Item {
	@NetworkedBasicField("m_iStat")
	public ActiveAttribute = EStoneFeatherAttribute.NONE
}
