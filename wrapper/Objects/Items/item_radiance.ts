import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_radiance")
export default class item_radiance extends Item {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aura_radius", level)
	}
}
