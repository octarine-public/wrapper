import { WrapperClass } from "../../Decorators"
import { EModifierfunction } from "../../Enums/EModifierfunction"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_famango")
export class item_famango
	extends Item
	implements IManaRestore<Unit>, IHealthRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	public GetManaRestore(_target: Unit): number {
		return this.GetRestoreModifier(
			this.Owner,
			this.GetSpecialValue("replenish_amount")
		)
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetRestoreModifier(
			this.Owner,
			this.GetSpecialValue("replenish_amount")
		)
	}

	protected GetRestoreModifier(owner: Nullable<Unit>, baseValue: number): number {
		if (owner === undefined) {
			return baseValue
		}
		const percentage = owner.ModifierManager.GetConditionalAdditiveInternal(
			EModifierfunction.MODIFIER_PROPERTY_BONUS_LOTUS_HEAL,
			false,
			1,
			1
		)
		return baseValue * (1 + percentage / 100)
	}
}
