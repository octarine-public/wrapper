import { WrapperClass } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Ability } from "../../Base/Ability"

@WrapperClass("ancient_apparition_cold_feet")
export class ancient_apparition_cold_feet extends Ability {
	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		return this.GetBaseAOERadiusForLevel(this.Level) === 0
			? super.AbilityBehaviorMask
			: DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("area_of_effect", level)
	}
}
