import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("nyx_assassin_spiked_carapace")
export class nyx_assassin_spiked_carapace extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.Owner?.HasBuffByName("modifier_nyx_assassin_burrow")
			? this.GetSpecialValue("burrow_aoe", level)
			: 0
	}
}
