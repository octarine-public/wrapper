import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("storm_spirit_ball_lightning")
export class storm_spirit_ball_lightning extends Ability {
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		if (owner.Mana - this.ManaCost <= 0) {
			return 0
		}
		const distance = owner.Distance2D(target) / 100,
			damagePerCost = owner.MaxMana * (this.PercentTravelCost() / 100)
		return super.GetRawDamage(target) + distance * damagePerCost
	}
	public GetBaseCastRangeForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const remainingMana = owner.Mana - this.ManaCost
		if (remainingMana <= 0) {
			return 0
		}
		const baseCost = this.BaseTravelCost(level),
			percentCost = this.PercentTravelCost(level)
		const cost = baseCost + owner.MaxMana * (percentCost / 100)
		return cost !== 0 ? Math.ceil(remainingMana / cost) * 100 : 0
	}
	public BaseTravelCost(level: number = this.Level): number {
		return this.GetSpecialValue("ball_lightning_travel_cost_base", level)
	}
	public PercentTravelCost(level: number = this.Level): number {
		return this.GetSpecialValue("ball_lightning_travel_cost_percent", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("ball_lightning_aoe", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("ball_lightning_move_speed", level)
	}
}
