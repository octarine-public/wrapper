import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sniper_assassinate")
export class sniper_assassinate extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_sniper/sniper_assassinate.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
