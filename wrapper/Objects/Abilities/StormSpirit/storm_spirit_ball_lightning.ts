import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("storm_spirit_ball_lightning")
export class storm_spirit_ball_lightning extends Ability {
	// TODO: fix me
	public GetCastRangeForLevel(level: number): number {
		const mana = (this.Owner?.Mana ?? 0) - this.ManaCost
		if (mana <= 0) {
			return 0
		}

		const travelCost =
			this.GetSpecialValue("ball_lightning_travel_cost_base", level) +
			(this.Owner?.MaxMana ?? 0) *
				(this.GetSpecialValue("ball_lightning_travel_cost_percent", level) / 100)

		return travelCost !== 0 ? Math.ceil(mana / travelCost) * 100 : 0
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("ball_lightning_aoe", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("ball_lightning_move_speed", level)
	}
}
