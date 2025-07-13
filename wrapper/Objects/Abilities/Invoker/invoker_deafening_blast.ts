import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_deafening_blast")
export class invoker_deafening_blast extends invoker_spell_extends implements INuke {
	public get IsRadial(): boolean {
		return this.RadialCount > 1
	}
	public get EndRadius(): number {
		return this.GetSpecialValue("radius_end")
	}
	public get AbilityDamage() {
		return this.GetBaseDamageForLevel(this.Level + this.ExortLevel)
	}
	public get RadialCount(): number {
		return this.GetSpecialValue("radial_count")
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius_start", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("travel_speed", level)
	}
}
