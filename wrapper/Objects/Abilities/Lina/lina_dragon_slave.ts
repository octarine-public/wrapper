import { WrapperClass } from "../../../Decorators"
import { modifier_lina_fiery_soul } from "../../../Objects/Modifiers/Abilities/Lina/modifier_lina_fiery_soul"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("lina_dragon_slave")
export class lina_dragon_slave extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("dragon_slave_width_end")
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_damage", level)
	}
	public GetBaseCastRangeForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_distance", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_speed", level)
	}
	public GetCastRangeForLevel(level: number): number {
		return this.GetBaseCastRangeForLevel(level) + this.GetBaseAOERadiusForLevel(level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("dragon_slave_width_initial", level)
	}
	public GetRawDamage(target: Unit): number {
		return this.rawTotalDamage(super.GetRawDamage(target))
	}

	private rawTotalDamage(baseDamage: number = 0): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return baseDamage
		}
		const modifier = owner.GetBuffByClass(modifier_lina_fiery_soul)
		if (modifier === undefined) {
			return baseDamage
		}
		return modifier.GetSpellBonusDamage(baseDamage)
	}
}
