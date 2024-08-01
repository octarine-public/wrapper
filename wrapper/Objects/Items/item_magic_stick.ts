import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_magic_stick")
export class item_magic_stick
	extends Item
	implements IManaRestore<Unit>, IHealthRestore<Unit>
{
	public RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public get RestorePerCharge(): number {
		return this.GetSpecialValue("restore_per_charge")
	}
	public CanBeCasted(bonusMana?: number): boolean {
		return this.CurrentCharges > 0 && super.CanBeCasted(bonusMana)
	}
	public GetManaRestore(_target: Unit): number {
		return this.CurrentCharges * this.RestorePerCharge
	}
	public GetHealthRestore(_target: Unit): number {
		return this.CurrentCharges * this.RestorePerCharge
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("charge_radius", level)
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
