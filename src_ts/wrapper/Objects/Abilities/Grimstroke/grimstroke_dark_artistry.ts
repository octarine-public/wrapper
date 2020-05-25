import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("grimstroke_dark_artistry")
export default class grimstroke_dark_artistry extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}
