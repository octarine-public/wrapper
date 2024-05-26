import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("earthshaker_enchant_totem")
export class earthshaker_enchant_totem extends Ability {
	public get AftershockRadius() {
		const owner = this.Owner
		if (owner === undefined || owner.IsPassiveDisabled) {
			return 0
		}
		const aftershock = owner.GetAbilityByName("earthshaker_aftershock")
		if (aftershock === undefined) {
			return 0
		}
		return aftershock.AOERadius
	}

	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("distance_scepter", level)
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("scepter_cleave_distance", level)
	}
}
