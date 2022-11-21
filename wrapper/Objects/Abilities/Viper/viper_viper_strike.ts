import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("viper_viper_strike")
export class viper_viper_strike extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("max_charges") : 0
	}
	public get ChargeRestoreTime(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("charge_restore_time")
			: 0
	}
}
