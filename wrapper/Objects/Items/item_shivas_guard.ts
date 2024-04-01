import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_shivas_guard")
export class item_shivas_guard extends Item {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("blast_damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("blast_radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("blast_speed", level)
	}
}
