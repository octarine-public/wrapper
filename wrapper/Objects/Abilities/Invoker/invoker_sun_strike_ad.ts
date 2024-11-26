import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_sun_strike_ad")
export class invoker_sun_strike_ad extends invoker_spell_extends {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
