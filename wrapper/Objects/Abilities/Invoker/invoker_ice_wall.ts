import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_ice_wall")
export class invoker_ice_wall extends invoker_spell_extends {
	public get MaxDuration() {
		return this.GetMaxDurationForLevel(this.QuasLevel)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
}
