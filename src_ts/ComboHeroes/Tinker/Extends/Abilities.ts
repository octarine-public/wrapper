import { Ability as AbilitySDK, Hero } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"

export default class TinkerAbility extends AbilityBase {
	private MysticFlareDelay: number = 300
	private MysticFlareDelayScepter: number = 610
	constructor(unit: Hero) {
		super(unit)
	}
	public get q(): AbilitySDK {
		return this.unit.GetAbilityByName("tinker_laser")
	}
	public get w(): AbilitySDK {
		return this.unit.GetAbilityByName("tinker_heat_seeking_missile")
	}
	public get e(): AbilitySDK {
		return this.unit.GetAbilityByName("tinker_march_of_the_machines")
	}
	public get r(): AbilitySDK {
		return this.unit.GetAbilityByName("tinker_rearm")
	}

}
