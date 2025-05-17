import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_bounty_hunter_jinada } from "../../Modifiers/Abilities/BountyHunter/modifier_bounty_hunter_jinada"

@WrapperClass("bounty_hunter_jinada")
export class bounty_hunter_jinada extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let bonusDamage = 0
		const modifier = owner.GetBuffByClass(modifier_bounty_hunter_jinada)
		if (!this.IsAutoCastEnabled && !(modifier?.IsAnimation ?? false)) {
			bonusDamage = modifier?.CachedDamage ?? this.GetSpecialValue("bonus_damage")
		}
		return owner.GetRawAttackDamage(target) + bonusDamage
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
