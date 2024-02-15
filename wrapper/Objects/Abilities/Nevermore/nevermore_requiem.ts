import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("nevermore_requiem")
export class nevermore_requiem extends Ability {
	public get WidthEnd(): number {
		return this.GetSpecialValue("requiem_line_width_end")
	}
	public get WidthStart(): number {
		return this.GetSpecialValue("requiem_line_width_start")
	}
	public get AOERadius(): number {
		return super.AOERadius + this.WidthEnd
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("requiem_radius", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("requiem_line_speed", level)
	}
}
