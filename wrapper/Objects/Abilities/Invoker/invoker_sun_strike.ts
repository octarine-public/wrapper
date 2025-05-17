import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_sun_strike")
export class invoker_sun_strike extends invoker_spell_extends implements INuke {
	public get AbilityDamage() {
		return this.GetBaseDamageForLevel(this.Level + this.ExortLevel)
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
