import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("gyrocopter_flak_cannon")
export default class gyrocopter_flak_cannon extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
