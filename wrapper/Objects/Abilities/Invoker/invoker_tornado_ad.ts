import { WrapperClass } from "../../../Decorators"
import { invoker_spell_extends } from "./invoker_spell_extends"

@WrapperClass("invoker_tornado_ad")
export class invoker_tornado_ad extends invoker_spell_extends implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
}
