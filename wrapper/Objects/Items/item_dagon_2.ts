import { WrapperClass } from "../../Decorators"
import { item_dagon } from "./item_dagon"

@WrapperClass("item_dagon_2")
export class item_dagon_2 extends item_dagon {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
