import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("roshan_halloween_apocalypse")
export class roshan_halloween_apocalypse extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("delay", level)
	}
}
