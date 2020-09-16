import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("nyx_assassin_spiked_carapace")
export default class nyx_assassin_spiked_carapace extends Ability {
	public get AOERadius(): number {
		return this.Owner?.HasBuffByName("modifier_nyx_assassin_burrow")
			? this.GetSpecialValue("burrow_aoe")
			: 0
	}
}
