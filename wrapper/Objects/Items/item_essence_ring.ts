import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_essence_ring")
export class item_essence_ring extends Item implements IHealthRestore<Unit> {
	public readonly RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = true
	public readonly ManaRestoreModifierName = "modifier_item_essence_ring_active"

	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("health_gain")
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
