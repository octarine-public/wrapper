import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_lion_finger_of_death_kill_counter } from "../../Modifiers/Abilities/Lion/modifier_lion_finger_of_death_kill_counter"

@WrapperClass("lion_finger_of_death")
export class lion_finger_of_death extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("splash_radius_scepter", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.OwnerHasScepter
			? this.GetSpecialValue("cooldown_scepter", level)
			: super.GetMaxCooldownForLevel(level)
	}
	public GetRawDamage(target: Unit): number {
		return this.rawTotalDamage(super.GetRawDamage(target))
	}
	private rawTotalDamage(baseDamage: number = 0): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return baseDamage
		}
		const modifier = owner.GetBuffByClass(modifier_lion_finger_of_death_kill_counter)
		if (modifier === undefined) {
			return baseDamage
		}
		return modifier.GetSpellBonusDamage(baseDamage)
	}
}
