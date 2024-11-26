import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_tornado")
export class invoker_tornado extends invoker_spell_extends {
	public get AbilityDamage(): number {
		return this.GetBaseDamageForLevel(this.Level + this.WexLevel)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("wex_damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("travel_speed", level)
	}
}
