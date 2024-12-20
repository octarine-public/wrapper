import { WrapperClass } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_bristleback")
export class bristleback_bristleback extends Ability {
	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		const mask = super.AbilityBehaviorMask
		return this.OwnerHasScepter
			? mask | DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
			: mask
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("activation_delay", level)
	}
}
