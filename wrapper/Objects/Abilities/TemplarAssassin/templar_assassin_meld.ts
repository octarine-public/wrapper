import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("templar_assassin_meld")
export class templar_assassin_meld extends Ability {
	public get IsInvisibility(): boolean {
		return true
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("bonus_damage", level)
	}

	public GetBaseSpeedForLevel(_level: number): number {
		return this.Owner?.AttackProjectileSpeed ?? 0
	}
}
