import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_cheese")
export class item_cheese
	extends Item
	implements IManaRestore<Unit>, IHealthRestore<Unit>
{
	public readonly RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("mana_restore")
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("health_restore")
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
