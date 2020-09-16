import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("sniper_assassinate")
export default class sniper_assassinate extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
