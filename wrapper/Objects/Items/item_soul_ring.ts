import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_soul_ring")
export class item_soul_ring extends Item implements IHealthCost, IManaRestore<Unit> {
	public readonly RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public get HealthCost() {
		return this.GetSpecialValue("health_sacrifice")
	}
	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("mana_gain")
	}
	public IsHealthCost(): this is IHealthCost {
		return true
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
}
