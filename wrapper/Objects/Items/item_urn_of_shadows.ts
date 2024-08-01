import { WrapperClass } from "../../Decorators"
import { DAMAGE_TYPES } from "../../Enums/DAMAGE_TYPES"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_urn_of_shadows")
export class item_urn_of_shadows extends Item implements IHealthRestore<Unit> {
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = false
	public HealthRestoreModifierName = "modifier_item_urn_heal"

	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
	}
	public CanBeCasted(bonusMana: number = 0) {
		return this.CurrentCharges > 0 && super.CanBeCasted(bonusMana)
	}
	public GetHealthRestore(_target: Unit): number {
		return this.GetSpecialValue("soul_heal_amount")
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
}
