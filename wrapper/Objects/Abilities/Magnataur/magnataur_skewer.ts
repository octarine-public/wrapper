import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("magnataur_skewer")
export class magnataur_skewer extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("range", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("skewer_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("skewer_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("skewer_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		return !target.IsCreep ? super.GetRawDamage(target) : 0
	}
}
