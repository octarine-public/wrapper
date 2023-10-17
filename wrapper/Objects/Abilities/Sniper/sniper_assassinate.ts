import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("sniper_assassinate")
export class sniper_assassinate extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
