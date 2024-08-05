import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_royal_jelly")
export class item_royal_jelly
	extends Item
	implements IHealthRestore<Unit>, IManaRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly ManaRestoreModifierName = "modifier_royal_jelly_regen"
	public readonly HealthRestoreModifierName = this.ManaRestoreModifierName

	public GetManaRestore(_target: Unit): number {
		const healthRegen = this.GetSpecialValue("health_regen")
		return this.CurrentCharges * healthRegen * this.MaxDuration
	}
	public GetHealthRestore(_target: Unit): number {
		const healthRegen = this.GetSpecialValue("mana_regen")
		return this.CurrentCharges * healthRegen * this.MaxDuration
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("regen_duration", level)
	}
	public GetMaxChargesForLevel(level: number): number {
		return this.GetSpecialValue("max_charges", level)
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
