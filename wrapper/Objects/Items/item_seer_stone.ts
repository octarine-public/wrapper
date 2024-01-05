import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_seer_stone")
export class item_seer_stone extends Item {
	public get BonusCastRange(): number {
		return this.GetSpecialValue("cast_range_bonus")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetCastRangeForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
