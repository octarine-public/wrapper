import { ItemImagePath } from "../../Data/PathData"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_radiance")
export class item_radiance extends Item {
	public get TexturePath(): string {
		return !this.IsToggled
			? super.TexturePath
			: ItemImagePath + "/radiance_inactive_png.vtex_c"
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aura_radius", level)
	}
}
