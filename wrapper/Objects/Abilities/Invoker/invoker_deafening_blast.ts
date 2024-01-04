import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("invoker_deafening_blast")
export class invoker_deafening_blast extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("radius_end")
	}
	public get Speed(): number {
		return this.GetSpecialValue("travel_speed")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius_start", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
