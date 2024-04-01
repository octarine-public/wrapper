import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("invoker_emp_ad")
export class invoker_emp_ad extends Ability {
	@NetworkedBasicField("m_nQuasLevel")
	public QuasLevel = 0
	@NetworkedBasicField("m_nWexLevel")
	public WexLevel = 0
	@NetworkedBasicField("m_nExortLevel")
	public ExortLevel = 0

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
