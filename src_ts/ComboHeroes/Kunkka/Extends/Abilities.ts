//@ts-nocheck
import { Ability, Hero, Unit } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class KunkkaAbility extends AbilityBase {
	constructor(unit?: Hero | Unit) {
		super(unit)
	}
	public get Torrent(): Ability {
		let name = "kunkka_torrent"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Tidebringer(): Ability {
		let name = "kunkka_tidebringer"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get MarksSpot(): Ability {
		let name = "kunkka_x_marks_the_spot"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Return(): Ability {
		let name = "kunkka_return"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
	public get Ghostship(): Ability {
		let name = "kunkka_ghostship"
		if (this.unit === undefined) {
			return name as any
		}
		return this.unit.GetAbilityByName(name)
	}
}
