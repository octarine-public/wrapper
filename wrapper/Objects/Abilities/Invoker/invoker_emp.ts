import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_emp")
export class invoker_emp extends invoker_spell_extends {
	public get AbilityDamage() {
		return this.GetBaseDamageForLevel(this.Level + this.WexLevel)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("mana_burned", level)
	}
}
