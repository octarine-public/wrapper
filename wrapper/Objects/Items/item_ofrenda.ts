import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("CDOTA_Item_Ofrenda")
export class item_ofrenda extends Item {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
