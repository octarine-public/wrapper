import { WrapperClass } from "../../../Decorators"
import { ATTACK_DAMAGE_STRENGTH } from "../../../Enums/ATTACK_DAMAGE_STRENGTH"
import { DAMAGE_TYPES } from "../../../Enums/DAMAGE_TYPES"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_tusk_walrus_punch } from "../../Modifiers/Abilities/Tusk/modifier_tusk_walrus_punch"

@WrapperClass("tusk_walrus_punch")
export class tusk_walrus_punch extends Ability {
	public get DamageType(): DAMAGE_TYPES {
		return DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const damage = owner.GetRawAttackDamage(target)
		if (this.IsReady && (this.IsAutoCastEnabled || this.isAnimation(owner))) {
			return damage
		}
		const bonus = this.GetSpecialValue("bonus_damage"),
			multiplier = this.GetSpecialValue("crit_multiplier")
		return (damage + bonus) * (multiplier / 100)
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

	private isAnimation(owner: Unit): boolean {
		const modifier = owner.GetBuffByClass(modifier_tusk_walrus_punch)
		return modifier?.IsAnimation ?? false
	}
}
