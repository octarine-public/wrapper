import { Ability, Hero, Unit } from "wrapper/Imports"

export class AbilityHelper {
	constructor(public readonly unit: Hero | Unit) { }

	public get Tick() {
		return 100
	}
	public CastDelay(ability: Ability): number {
		return ((ability.GetCastDelay(this.unit.NetworkPosition) * 1000) + this.Tick)
	}
}
