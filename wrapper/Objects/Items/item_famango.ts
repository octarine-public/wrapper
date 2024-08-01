import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_famango")
export class item_famango
	extends Item
	implements IManaRestore<Unit>, IHealthRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("replenish_amount")
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("replenish_amount")
	}
}
