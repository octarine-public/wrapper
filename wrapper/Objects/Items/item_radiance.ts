import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_radiance")
export default class item_radiance extends Item {
	public get AOERadius(): number {
		return this.GetSpecialValue("aura_radius")
	}
}
