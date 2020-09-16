import Item from "../Base/Item"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("item_power_treads")
export default class item_power_treads extends Item {
	@NetworkedBasicField("m_iStat")
	public ActiveAttribute = 0
}
