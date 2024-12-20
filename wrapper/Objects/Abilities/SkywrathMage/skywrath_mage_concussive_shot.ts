import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("skywrath_mage_concussive_shot")
export class skywrath_mage_concussive_shot extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("launch_radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetCastRangeForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return super.GetCastRangeForLevel(level)
		}
		const talent = owner.GetAbilityByName("special_bonus_unique_skywrath_4")
		return talent !== undefined && talent.Level !== 0
			? Number.MAX_SAFE_INTEGER
			: super.GetCastRangeForLevel(level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let baseDamage = super.GetRawDamage(target)
		if (target.IsCreep) {
			baseDamage *= 1 + this.GetSpecialValue("creep_damage_pct") / 100
		}
		return baseDamage
	}
}
