import { ItemImagePath } from "../../Data/PathData"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_ring_of_aquila")
export class item_ring_of_aquila extends Item {
	public get TexturePath(): string {
		return !this.IsToggled
			? super.TexturePath
			: ItemImagePath + "/ring_of_aquila_active_png.vtex_c"
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aura_radius", level)
	}
}
