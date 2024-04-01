import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lion_finger_of_death")
export class lion_finger_of_death extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("splash_radius_scepter", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetMaxCooldownForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("cooldown_scepter", level)
			: super.GetMaxCooldownForLevel(level)
	}
}
