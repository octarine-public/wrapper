import { Paths } from "../../Data/ImageData"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_rapier")
export class item_rapier extends Item {
	public get TexturePath(): string {
		return this.IsToggled
			? Paths.ItemIcons + "/rapier_alt_png.vtex_c"
			: super.TexturePath
	}
}
