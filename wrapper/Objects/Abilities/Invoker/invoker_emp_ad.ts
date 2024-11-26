import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_emp_ad")
export class invoker_emp_ad extends invoker_spell_extends {
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
