import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("templar_assassin_meld")
export class templar_assassin_meld extends Ability {
	public get IsInvisibility(): boolean {
		return true
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
