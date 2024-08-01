import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_faerie_fire")
export class item_faerie_fire extends Item implements IHealthRestore<Unit> {
	public readonly RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("hp_restore")
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
