import { Ability, Hero, Game } from "wrapper/Imports"
export class AbilityHelper {
	public readonly unit: Hero
	public get Tick() {
		return ((Game.Ping / 2) + 30)
	}
	constructor(unit: Hero) {
		this.unit = unit
	}
	public CastDelay(ability: Ability): number {
		return ((ability.GetCastDelay(this.unit.NetworkPosition) * 1000) + this.Tick)
	}
}
