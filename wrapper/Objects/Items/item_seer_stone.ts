import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_seer_stone")
export default class item_seer_stone extends Item {
	public GetCastRangeForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
}
