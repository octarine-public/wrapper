import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Creep } from "../../Base/Creep"
import { Unit } from "../../Base/Unit"
import { modifier_nyx_assassin_jolt_damage_tracker } from "../../Modifiers/Abilities/NyxAssassin/modifier_nyx_assassin_jolt_damage_tracker"

@WrapperClass("nyx_assassin_jolt")
export class nyx_assassin_jolt extends Ability {
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0 || target.MaxMana === 0) {
			return 0
		}
		if (target instanceof Creep && !target.IsNeutral) {
			return 99999
		}
		const multiplier = this.GetSpecialValue("max_mana_as_damage_pct")
		return (target.MaxMana * multiplier) / 100 + this.echoDamage(target)
	}
	private echoDamage(target: Unit) {
		const multiplier = this.GetSpecialValue("damage_echo_pct")
		return (this.bonusDamage(target) * multiplier) / 100
	}
	private bonusDamage(target: Unit) {
		const modifier = target.GetBuffByClass(modifier_nyx_assassin_jolt_damage_tracker)
		return modifier?.BonusTotalDamage ?? 0
	}
}
