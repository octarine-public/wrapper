import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Creep } from "../../Base/Creep"
import { Unit } from "../../Base/Unit"

@WrapperClass("mirana_arrow")
export class mirana_arrow extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("arrow_width", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("arrow_speed", level)
	}
	public GetRawDamage(target: Unit): number {
		return target instanceof Creep && !target.IsAncient
			? Number.MAX_SAFE_INTEGER
			: super.GetRawDamage(target)
	}
}
