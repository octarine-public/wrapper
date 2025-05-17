import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_centaur_double_edge_damage_tracking } from "../../Modifiers/Abilities/Centaur/modifier_centaur_double_edge_damage_tracking"

@WrapperClass("centaur_double_edge")
export class centaur_double_edge extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetRawDamage(target: Unit): number {
		return this.totalDamage(super.GetRawDamage(target), target)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("edge_damage", level)
	}
	private totalDamage(baseDamage: number, target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return baseDamage
		}
		const strPct = this.GetSpecialValue("strength_damage")
		const damage = baseDamage + (owner.TotalStrength * strPct) / 100
		const modifier = owner.GetBuffByClass(
			modifier_centaur_double_edge_damage_tracking
		)
		if (modifier === undefined) {
			return damage
		}
		return damage + modifier.GetBonusDamage(target)
	}
}
