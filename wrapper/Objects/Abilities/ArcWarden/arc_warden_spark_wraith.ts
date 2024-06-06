import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("arc_warden_spark_wraith")
export class arc_warden_spark_wraith extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const specialName = `${owner.IsClone ? "tempest" : "base"}_activation_delay`
		return this.GetSpecialValue(specialName, level)
	}
	public GetBaseDamageForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const specialName = `spark_damage_${owner.IsClone ? "tempest" : "base"}`
		return this.GetSpecialValue(specialName, level)
	}
}
