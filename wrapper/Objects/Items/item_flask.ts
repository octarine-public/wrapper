import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_flask")
export class item_flask extends Item implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly HealthRestoreModifierName = "modifier_flask_healing"

	public GetHealthRestore(_target: Unit) {
		return this.GetSpecialValue("health_regen") * this.MaxDuration
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("buff_duration", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
