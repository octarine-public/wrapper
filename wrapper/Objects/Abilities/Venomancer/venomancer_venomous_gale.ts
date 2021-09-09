import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("venomancer_venomous_gale")
export default class venomancer_venomous_gale extends Ability {
	public get SkillshotRange(): number {
		return this.CastRange + this.AOERadius
	}
}
