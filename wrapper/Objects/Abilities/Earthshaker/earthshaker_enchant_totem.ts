import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("earthshaker_enchant_totem")
export class earthshaker_enchant_totem extends Ability {
	public get ScepterRadius() {
		return this.GetSpecialValue("scepter_cleave_distance")
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("distance_scepter", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		const aftershock = this.Owner?.GetAbilityByName("earthshaker_aftershock")
		return aftershock?.GetBaseAOERadiusForLevel(level) ?? 0
	}
}
