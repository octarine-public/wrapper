import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_harpoon")
export class item_harpoon extends Item {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
}
