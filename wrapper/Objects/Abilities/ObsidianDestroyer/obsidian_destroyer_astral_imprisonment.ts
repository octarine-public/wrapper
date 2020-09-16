import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("obsidian_destroyer_astral_imprisonment")
export default class obsidian_destroyer_astral_imprisonment extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("max_charges_scepter") : 0
	}
	public get ChargeRestoreTime(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("charge_restore_time_scepter") : 0
	}
}
