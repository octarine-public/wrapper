import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("razor_plasma_field")
export class razor_plasma_field extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const max = this.GetSpecialValue("damage_max"),
			min = this.GetSpecialValue("damage_min"),
			value = (owner.Distance2D(target) - 100) / this.AOERadius
		return Math.remapRange(value, 0, 1, min, max)
	}
}
