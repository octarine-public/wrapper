import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("tidehunter_anchor_smash")
export class tidehunter_anchor_smash extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		const value = this.GetSpecialValue("additional_range", level)
		if (value === 0 || this.Owner === undefined) {
			return value
		}
		return this.Owner.GetAttackRange() + value
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("attack_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return owner.GetRawAttackDamage(target) + super.GetRawDamage(target)
	}
	public GetDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		return owner.GetAttackDamage(
			target,
			ATTACK_DAMAGE_STRENGTH.DAMAGE_MIN,
			this.GetRawDamage(target)
		)
	}
}
