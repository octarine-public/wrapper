import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_viscous_nasal_goo")
export class bristleback_viscous_nasal_goo extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo.vpcf"
	public GetAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("radius_scepter", level)
			: 0
	}
}
