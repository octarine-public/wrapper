import { WrapperClass } from "../../Decorators"
import { item_magic_wand } from "./item_magic_wand"

@WrapperClass("item_holy_locket")
export class item_holy_locket extends item_magic_wand {
	public readonly RestoresAlly = true
}
