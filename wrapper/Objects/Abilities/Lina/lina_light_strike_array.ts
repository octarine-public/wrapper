import { WrapperClass } from "../../../Decorators"
import { modifier_lina_fiery_soul } from "../../../Objects/Modifiers/Abilities/Lina/modifier_lina_fiery_soul"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("lina_light_strike_array")
export class lina_light_strike_array extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("light_strike_array_aoe", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("light_strike_array_damage", level)
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("light_strike_array_delay_time", level)
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
