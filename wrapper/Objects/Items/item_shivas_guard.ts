import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_shivas_guard")
export class item_shivas_guard extends Item {
	public get Speed() {
		return this.GetSpecialValue("blast_speed")
	}
	public get AbilityDamage() {
		return this.GetSpecialValue("blast_damage")
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("blast_radius", level)
	}
}
