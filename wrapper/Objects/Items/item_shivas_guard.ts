import { WrapperClass } from "../../Decorators"
import Item from "../Base/Item"

@WrapperClass("item_shivas_guard")
export default class item_shivas_guard extends Item {
	public get AOERadius() {
		return this.GetSpecialValue("blast_radius")
	}
	public get Speed() {
		return this.GetSpecialValue("blast_speed")
	}
	public get AbilityDamage() {
		return this.GetSpecialValue("blast_damage")
	}
}
