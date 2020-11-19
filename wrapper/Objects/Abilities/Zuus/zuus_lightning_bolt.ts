import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("zuus_lightning_bolt")
export default class zuus_lightning_bolt extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("spread_aoe")
	}
}
