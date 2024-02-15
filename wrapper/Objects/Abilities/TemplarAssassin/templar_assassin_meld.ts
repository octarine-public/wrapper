import { WrapperClass } from "../../../Decorators"
import { AbilityLogicType } from "../../../Enums/AbilityLogicType"
import { Ability } from "../../Base/Ability"

@WrapperClass("templar_assassin_meld")
export class templar_assassin_meld extends Ability {
	public get AbilityLogicType(): AbilityLogicType {
		return AbilityLogicType.Invisibility
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bonus_damage", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseSpeedForLevel(_level: number): number {
		return this.Owner?.AttackProjectileSpeed ?? 0
	}
}
