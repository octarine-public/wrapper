import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_assault")
export default class item_assault extends Item {
	public static readonly AuraModifierName: string = "modifier_item_assault_negative_armor"
}
