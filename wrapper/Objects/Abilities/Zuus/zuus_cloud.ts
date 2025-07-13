import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_zuus_static_field } from "../../Modifiers/Abilities/Zuus/modifier_zuus_static_field"

@WrapperClass("zuus_cloud")
export class zuus_cloud extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseCastRangeForLevel(_level: number): number {
		return Number.MAX_SAFE_INTEGER
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("cloud_radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("cloud_duration", level)
	}
	public GetBaseDamageForLevel(_level: number): number {
		const bolt = this.Owner?.GetAbilityByName("zuus_lightning_bolt")
		return bolt?.GetBaseDamageForLevel(bolt.Level) ?? 0
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
