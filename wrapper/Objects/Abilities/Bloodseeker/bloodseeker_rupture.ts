import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bloodseeker_rupture")
export class bloodseeker_rupture extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("max_charges_scepter")
			: 0
	}
	public get ChargeRestoreTime(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("charge_restore_time_scepter")
			: 0
	}
}
