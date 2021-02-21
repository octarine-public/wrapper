import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("monkey_king_boundless_strike")
export default class monkey_king_boundless_strike extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("strike_radius")
	}
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
}
