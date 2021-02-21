import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("magnataur_shockwave")
export default class magnataur_shockwave extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("shock_width")
	}
	public get Speed(): number {
		return this.GetSpecialValue("shock_speed")
	}
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
}
