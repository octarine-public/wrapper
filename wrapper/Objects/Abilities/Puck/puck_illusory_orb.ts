import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("puck_illusory_orb")
export class puck_illusory_orb extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("orb_speed")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("max_distance", level)
	}
}
