import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("phantom_lancer_doppelwalk")
export class phantom_lancer_doppelwalk extends Ability {
	public get AppearanceDelay(): number {
		return this.GetSpecialValue("delay")
	}
}
