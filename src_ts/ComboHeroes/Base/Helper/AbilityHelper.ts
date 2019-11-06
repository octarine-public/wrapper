import { Ability, Hero, Unit } from "wrapper/Imports"

export class AbilityHelper {
	public readonly unit: Hero | Unit
	constructor(unit: Hero | Unit) {
		this.unit = unit
	}
	public get Tick() {
		return 100
	}
	public CastDelay(ability: Ability): number {
		return ((ability.GetCastDelay(this.unit.NetworkPosition) * 1000) + this.Tick)
	}
}
