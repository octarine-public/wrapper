import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_blade_mail")
export default class item_blade_mail extends Item {
	public static readonly ModifierName: string = "modifier_item_blade_mail_reflect"
}
