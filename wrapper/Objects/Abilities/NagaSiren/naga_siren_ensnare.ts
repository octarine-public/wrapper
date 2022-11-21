import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("naga_siren_ensnare")
export class naga_siren_ensnare extends Ability {
	public readonly ProjectilePath =
		"particles/units/heroes/hero_siren/siren_net_projectile.vpcf"
}
