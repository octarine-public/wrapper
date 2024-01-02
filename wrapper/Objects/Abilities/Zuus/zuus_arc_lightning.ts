import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("zuus_arc_lightning")
export class zuus_arc_lightning extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("arc_damage")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
