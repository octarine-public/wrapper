import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("chen_divine_favor")
export default class chen_divine_favor extends Ability {
	public get AuraRadius(): number {
		return this.GetSpecialValue("aura_radius")
	}
}
