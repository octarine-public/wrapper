import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("beastmaster_wild_axes")
export class beastmaster_wild_axes extends Ability implements INuke {
	public get Speed() {
		// https://dota2.fandom.com/wiki/Beastmaster#Wild_Axes
		return 1200
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("axe_damage", level)
	}
}
