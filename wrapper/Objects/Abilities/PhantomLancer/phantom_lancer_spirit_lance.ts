import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("phantom_lancer_spirit_lance")
export default class phantom_lancer_spirit_lance extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("lance_damage")
	}
	public get Speed(): number {
		return this.GetSpecialValue("lance_speed")
	}
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_phantom_lancer/phantomlancer_spiritlance_projectile.vpcf",
			"particles/econ/items/phantom_lancer/phantom_lancer_immortal_ti6/phantom_lancer_immortal_ti6_spiritlance.vpcf"
		]
	}
}
