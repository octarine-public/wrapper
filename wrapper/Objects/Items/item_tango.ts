import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_tango")
export class item_tango extends Item implements IHealthRestore<Unit> {
	public readonly RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_tango_heal"

	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("buff_duration", level)
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("health_regen") * this.MaxDuration
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
