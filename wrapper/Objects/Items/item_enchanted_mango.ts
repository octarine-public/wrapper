import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_enchanted_mango")
export class item_enchanted_mango extends Item implements IManaRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("replenish_amount")
	}
}
