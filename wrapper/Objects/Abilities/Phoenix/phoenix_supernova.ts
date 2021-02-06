import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("phoenix_supernova")
export default class phoenix_supernova extends Ability {
	public get AOERadius() {
		return this.GetSpecialValue("aura_radius")
	}
}
