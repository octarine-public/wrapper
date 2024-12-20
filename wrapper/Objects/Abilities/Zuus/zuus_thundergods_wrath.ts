import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_zuus_static_field } from "../../Modifiers/Abilities/Zuus/modifier_zuus_static_field"

@WrapperClass("zuus_thundergods_wrath")
export class zuus_thundergods_wrath extends Ability {
	public GetBaseAOERadiusForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return this.rawDamage(super.GetRawDamage(target), target, owner)
	}
	private rawDamage(baseDamage: number, target: Unit, caster: Unit) {
		const modifier = caster.GetBuffByClass(modifier_zuus_static_field)
		return baseDamage + (modifier?.GetBonusDamage(target) ?? 0)
	}
}
