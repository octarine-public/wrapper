import { Paths } from "../../Data/ImageData"
import { WrapperClass } from "../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Item } from "../Base/Item"

@WrapperClass("item_rapier")
export class item_rapier extends Item {
	public get TexturePath(): string {
		if (
			!this.IsToggled ||
			!this.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE)
		) {
			return super.TexturePath
		}
		return Paths.ItemIcons + "/rapier_alt_png.vtex_c"
	}
}
