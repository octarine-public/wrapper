import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_assault")
export default class item_assault extends Item {
	public static readonly AuraModifierName: string = "modifier_item_assault_negative_armor"
}
