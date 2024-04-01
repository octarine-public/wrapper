import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("obsidian_destroyer_astral_imprisonment")
export class obsidian_destroyer_astral_imprisonment extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("max_charges_scepter") : 0
	}
	public get MaxChargeRestoreTime(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("charge_restore_time_scepter")
			: 0
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCastRange", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
