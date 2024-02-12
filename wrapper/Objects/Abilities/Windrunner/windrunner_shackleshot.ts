import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("windrunner_shackleshot")
export class windrunner_shackleshot extends Ability {
	public get ShackleAngle() {
		return this.GetSpecialValue("shackle_angle")
	}
	public get ShackleDistance() {
		return this.GetSpecialValue("shackle_distance")
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("arrow_speed", level)
	}
}
