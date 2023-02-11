import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { VambraceAttribute } from "../../Enums/VambraceAttribute"
import { Item } from "../Base/Item"

@WrapperClass("item_vambrace")
export class item_vambrace extends Item {
	@NetworkedBasicField("m_iStat")
	public ActiveAttribute = VambraceAttribute.STRENGTH
}
