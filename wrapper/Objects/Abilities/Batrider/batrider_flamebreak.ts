import { WrapperClass } from "../../../Decorators"
import { modifier_batrider_sticky_napalm } from "../../../Objects/Modifiers/Abilities/Batrider/modifier_batrider_sticky_napalm"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("batrider_flamebreak")
export class batrider_flamebreak extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("explosion_radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		return this.rawDamage(target, super.GetRawDamage(target))
	}
	private rawDamage(target: Unit, rawDamage: number): number {
		const modifier = target.GetBuffByClass(modifier_batrider_sticky_napalm)
		return rawDamage + (modifier?.GetBonusDamage(target) ?? 0)
	}
}
