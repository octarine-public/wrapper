import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_earthshaker_aftershock } from "../../Modifiers/Abilities/Earthshaker/modifier_earthshaker_aftershock"

@WrapperClass("earthshaker_echo_slam")
export class earthshaker_echo_slam extends Ability {
	private get aftershockAOEDamage() {
		const aftershock = this.Owner?.GetBuffByClass(modifier_earthshaker_aftershock)
		return aftershock?.AOEDamage ?? 0
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("echo_slam_damage_range", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("echo_slam_initial_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		return super.GetRawDamage(target) + this.aftershockAOEDamage
	}
}
