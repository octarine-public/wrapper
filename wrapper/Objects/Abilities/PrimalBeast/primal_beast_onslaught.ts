import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_PrimalBeast_Onslaught")
export class primal_beast_onslaught extends Ability {
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("charge_speed", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("knockback_damage", level)
	}
}
