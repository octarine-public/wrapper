import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("snapfire_scatterblast")
export class snapfire_scatterblast extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("blast_width_end")
	}
	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("blast_width_initial", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
