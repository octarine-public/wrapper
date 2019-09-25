import { Ability, Game, Hero } from "wrapper/Imports"
export class AbilityHelper {
	public readonly unit: Hero
	public readonly Tick: number = ((Game.Ping / 2) + 30)// 30 tick
	constructor(unit: Hero) {
		this.unit = unit
	}
	public CastDelay(ability: Ability): number {
		return ((ability.GetCastDelay(this.unit.NetworkPosition) * 1000) + this.Tick)
	}
}
