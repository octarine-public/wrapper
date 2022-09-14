import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("gyrocopter_flak_cannon")
export class gyrocopter_flak_cannon extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
