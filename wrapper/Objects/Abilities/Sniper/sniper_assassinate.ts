import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("sniper_assassinate")
export default class sniper_assassinate extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_sniper/sniper_assassinate.vpcf",
			"particles/econ/items/sniper/sniper_charlie/sniper_assassinate_charlie.vpcf"
		]
	}
}
