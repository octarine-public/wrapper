import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("invoker_sun_strike_ad")
export class invoker_sun_strike_ad extends Ability {
	@NetworkedBasicField("m_nQuasLevel")
	public QuasLevel = 0
	@NetworkedBasicField("m_nWexLevel")
	public WexLevel = 0
	@NetworkedBasicField("m_nExortLevel")
	public ExortLevel = 0

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
