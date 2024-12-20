import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("puck_dream_coil")
export class puck_dream_coil extends Ability {
	public get CanHitSpellImmuneEnemy(): boolean {
		const owner = this.Owner
		if (owner === undefined) {
			return super.CanHitSpellImmuneEnemy
		}
		const talent = owner.GetAbilityByName("special_bonus_unique_puck_5")
		if (talent === undefined || talent.Level === 0) {
			return super.CanHitSpellImmuneEnemy
		}
		return talent.GetSpecialValue("value") !== 0
	}

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("coil_break_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("coil_initial_damage", level)
	}
}
