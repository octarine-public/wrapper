import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_black_king_bar")
export class item_black_king_bar extends Item {
	public get CurrentCharges() {
		return this.GetSpecialValue("duration")
	}
	public set CurrentCharges(_newVal: number) {
		// to be implemented
	}
}
