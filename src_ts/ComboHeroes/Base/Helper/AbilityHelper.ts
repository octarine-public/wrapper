import { Ability, Hero } from "wrapper/Imports"
export class AbilityHelper {
	public readonly unit: Hero
	public readonly Tick = 1000 / 30 * 1.5
	constructor(unit: Hero) {
		this.unit = unit
	}
	public CastDelay(ability: Ability): number {
		return ((ability.GetCastDelay(this.unit.NetworkPosition) * 1000) + this.Tick)
	}
}
