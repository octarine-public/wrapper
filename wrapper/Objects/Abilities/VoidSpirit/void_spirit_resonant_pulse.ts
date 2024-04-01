import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("void_spirit_resonant_pulse")
export class void_spirit_resonant_pulse extends Ability {
	public get MaxCharges(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("max_charges") : 0
	}
	public get MaxChargeRestoreTime(): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("charge_restore_time") : 0
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
