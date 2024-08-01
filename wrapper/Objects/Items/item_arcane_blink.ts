import { WrapperClass } from "../../Decorators"
import { Unit } from "../Base/Unit"
import { item_blink } from "./item_blink"

@WrapperClass("item_arcane_blink")
export class item_arcane_blink
	extends item_blink
	implements IManaRestore<Unit>, IHealthRestore<Unit>
{
	public readonly RestoresAlly = false
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("mana_amount")
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("heal_amount")
	}
}
