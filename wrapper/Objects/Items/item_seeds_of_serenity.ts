import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("CDOTA_Item_SeedsOfSerenity")
export class item_seeds_of_serenity extends Item {
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
