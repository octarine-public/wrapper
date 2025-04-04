import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("techies_land_mines")
export class techies_land_mines extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("activation_delay", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return (
			super.GetBaseAOERadiusForLevel(level) +
			this.GetSpecialValue("cast_range_scepter_bonus", level)
		)
	}
}
