import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("ember_spirit_fire_remnant")
export class ember_spirit_fire_remnant extends Ability {
	public get Speed() {
		return (
			(this.Owner?.Speed ?? 0) *
			this.GetSpeedMultiplier(this.Owner?.HasScepter ?? false)
		)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetChargeRestoreTimeForLevel(level: number): number {
		return this.GetSpecialValue("AbilityChargeRestoreTime", level)
	}

	protected GetSpeedMultiplier(hasScepter: boolean): number {
		let multiplier = this.GetSpecialValue("speed_multiplier") / 100
		if (hasScepter) {
			multiplier *= this.GetSpecialValue("scepter_speed_multiplier")
		}
		return multiplier
	}
}
