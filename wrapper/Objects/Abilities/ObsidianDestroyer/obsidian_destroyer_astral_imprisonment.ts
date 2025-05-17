import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("obsidian_destroyer_astral_imprisonment")
export class obsidian_destroyer_astral_imprisonment extends Ability implements INuke {
	public get MaxCharges(): number {
		return this.OwnerHasScepter ? this.GetSpecialValue("max_charges_scepter") : 0
	}
	public get MaxChargeRestoreTime(): number {
		return this.OwnerHasScepter
			? this.GetSpecialValue("charge_restore_time_scepter")
			: 0
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const duration = this.GetSpecialValue("prison_duration"),
			baseDamage = super.GetRawDamage(target)
		return baseDamage - target.HPRegen * duration
	}
}
