import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lina_dragon_slave")
export class lina_dragon_slave extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("dragon_slave_width_end")
	}
	public get Speed(): number {
		return this.GetSpecialValue("dragon_slave_speed")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_distance", level)
	}
	public GetCastRangeForLevel(level: number): number {
		return super.GetCastRangeForLevel(level) + this.GetBaseAOERadiusForLevel(level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_width_initial", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
