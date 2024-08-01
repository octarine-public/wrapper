import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_mekansm")
export class item_mekansm extends Item implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true
	public readonly HealthRestoreModifierName = "modifier_item_mekansm_noheal"

	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal_amount")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("heal_radius", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
