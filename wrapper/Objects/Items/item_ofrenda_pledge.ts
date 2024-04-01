import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("CDOTA_Item_Ofrenda_Pledge")
export class item_ofrenda_pledge extends Item {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
