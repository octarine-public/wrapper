import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("harpy_storm_chain_lightning")
export class harpy_storm_chain_lightning extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("initial_damage", level)
	}
}
