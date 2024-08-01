import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_clarity")
export class item_clarity extends Item implements IManaRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public readonly ManaRestoreModifierName = "modifier_clarity_potion"

	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("mana_regen") * this.MaxDuration
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("buff_duration", level)
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
}
