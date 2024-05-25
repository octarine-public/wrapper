import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("earthshaker_enchant_totem")
export class earthshaker_enchant_totem extends Ability {
	public GetBaseAOERadiusForLevel(_level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const aftershock = owner.GetAbilityByName("earthshaker_aftershock")
		return aftershock?.AOERadius ?? 0
	}
}
