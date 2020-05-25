import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("phantom_lancer_doppelwalk")
export default class phantom_lancer_doppelwalk extends Ability {
	public get ActivationDelay(): number {
		return this.GetSpecialValue("delay")
	}
}
