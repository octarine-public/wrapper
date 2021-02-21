import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("nyx_assassin_impale")
export default class nyx_assassin_impale extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("width")
	}
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
}
