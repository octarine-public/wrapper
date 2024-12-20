import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("earth_spirit_rolling_boulder")
export class earth_spirit_rolling_boulder extends Ability {
	public GetRawDamage(target: Unit): number {
		const baseDamage = super.GetRawDamage(target)
		if (baseDamage === 0) {
			return baseDamage
		}
		return baseDamage + (this.Owner?.TotalStrength ?? 0)
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
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
