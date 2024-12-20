import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { modifier_tidehunter_krill_eater } from "../../../Objects/Modifiers/Abilities/Tidehunter/modifier_tidehunter_krill_eater"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("tidehunter_anchor_smash")
export class tidehunter_anchor_smash extends Ability {
	private get BaseBonusAOERadius(): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const modifier = owner.GetBuffByClass(modifier_tidehunter_krill_eater)
		return modifier?.BonusAOERadius ?? 0
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level) + this.BaseBonusAOERadius
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
