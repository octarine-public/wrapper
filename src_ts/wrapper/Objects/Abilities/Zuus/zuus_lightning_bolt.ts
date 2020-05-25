import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("zuus_lightning_bolt")
export default class zuus_lightning_bolt extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("spread_aoe")
	}
}
