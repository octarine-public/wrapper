import { ItemImagePath } from "../../Data/PathData"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_rapier")
export class item_rapier extends Item {
	public get TexturePath(): string {
		return this.IsToggled
			? ItemImagePath + "/rapier_alt_png.vtex_c"
			: super.TexturePath
	}
}
