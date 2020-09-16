import Item from "../Base/Item"
import { WrapperClass } from "../../Decorators"

@WrapperClass("item_blade_mail")
export default class item_blade_mail extends Item {
	public static readonly ModifierName: string = "modifier_item_blade_mail_reflect"
}
