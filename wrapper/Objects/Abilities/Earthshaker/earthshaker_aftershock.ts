import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { modifier_earthshaker_aftershock } from "../../Modifiers/Abilities/Earthshaker/modifier_earthshaker_aftershock"

@WrapperClass("earthshaker_aftershock")
export class earthshaker_aftershock extends Ability {
	public get AOERadius(): number {
		return this.GetBaseAOERadiusForLevel(this.Level) + this.bonusAOERadius
	}
	private get bonusAOERadius() {
		const aftershock = this.Owner?.GetBuffByClass(modifier_earthshaker_aftershock)
		return aftershock?.AOERadiusBonus ?? 0
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("aftershock_range", level)
	}
}
