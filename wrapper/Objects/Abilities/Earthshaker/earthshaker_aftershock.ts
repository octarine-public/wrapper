import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Hero } from "../../Base/Hero"

@WrapperClass("earthshaker_aftershock")
export class earthshaker_aftershock extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		const owner = this.Owner
		const baseRadius = this.GetSpecialValue("aftershock_range", level)
		if (!(owner instanceof Hero) || level === 0) {
			return baseRadius
		}
		if (owner.HeroFacetID !== 1 || this.Level === 0) {
			return baseRadius
		}
		const ownerLevel = owner.Level
		const intervalLevel = this.GetSpecialValue("aftershock_range_level_interval")
		const radiusPerInterval = this.GetSpecialValue(
			"aftershock_range_increase_per_level_interval"
		)
		const radiusPerLevel = Math.floor(ownerLevel / intervalLevel) * radiusPerInterval
		return baseRadius + radiusPerLevel
	}
}
