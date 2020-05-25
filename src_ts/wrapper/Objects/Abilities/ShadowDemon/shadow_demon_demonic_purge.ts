import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("shadow_demon_demonic_purge")
export default class shadow_demon_demonic_purge extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("max_charges") : 0
	}
	public get ChargeRestoreTime(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("charge_restore_time") : 0
	}
}
