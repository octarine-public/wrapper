import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("arc_warden_spark_wraith")
export class arc_warden_spark_wraith extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		let baseDamage = super.GetRawDamage(target)
		if (target.IsCreep) {
			baseDamage *= 1 + this.GetSpecialValue("creep_damage_bonus_pct") / 100
		}
		return baseDamage
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("spark_damage_base", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("base_activation_delay", level)
	}
}
