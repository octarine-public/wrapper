import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("CDOTA_Item_WandOfSanctitude")
export class item_wand_of_sanctitude extends Item {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
