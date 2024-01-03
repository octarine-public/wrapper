import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("pangolier_gyroshell")
export class pangolier_gyroshell extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("forward_move_speed")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
