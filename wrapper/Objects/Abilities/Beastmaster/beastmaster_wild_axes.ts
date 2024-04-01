import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("beastmaster_wild_axes")
export class beastmaster_wild_axes extends Ability {
	public get Speed() {
		// https://dota2.fandom.com/wiki/Beastmaster#Wild_Axes
		return 1200
	}

	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
