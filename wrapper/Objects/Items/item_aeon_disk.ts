import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_aeon_disk")
export default class item_aeon_disk extends Item {
	public static readonly ModifierName: string = "modifier_item_aeon_disk_buff"
}
