import { Paths } from "../../Data/ImageData"
import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_armlet")
export class item_armlet extends Item {
	public static readonly ModifierName: string = "modifier_item_armlet_unholy_strength"

	public get ToggleCooldown(): number {
		return this.GetSpecialValue("toggle_cooldown")
	}

	public get TexturePath(): string {
		return !this.IsToggled
			? super.TexturePath
			: Paths.ItemIcons + "/armlet_active_png.vtex_c"
	}
}
