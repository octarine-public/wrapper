import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_havoc_hammer")
export class item_havoc_hammer extends Item {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("range", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("nuke_base_dmg", level)
	}
}
