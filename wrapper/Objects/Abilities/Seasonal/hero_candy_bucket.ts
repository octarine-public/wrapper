import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("hero_candy_bucket")
export default class hero_candy_bucket extends Ability {
	public get MaxChannelTime(): number {
		return 0.2 + this.GetSpecialValue("candy_delivery_interval") * this.CurrentCharges
	}
}
