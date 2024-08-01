import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_guardian_greaves")
export class item_guardian_greaves
	extends Item
	implements IManaRestore<Unit>, IHealthRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true
	public readonly ManaRestoreModifierName = "modifier_item_mekansm_noheal"
	public readonly HealthRestoreModifierName = this.ManaRestoreModifierName

	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("replenish_mana")
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("replenish_health")
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("replenish_radius", level)
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
