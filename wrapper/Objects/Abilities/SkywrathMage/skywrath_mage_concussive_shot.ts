import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skywrath_mage_concussive_shot")
export class skywrath_mage_concussive_shot extends Ability {
	public readonly ProjectilePath =
		"particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf"
	public get Speed(): number {
		return this.GetSpecialValue("speed")
	}
	public GetCastRangeForLevel(level: number): number {
		const talent = this.Owner?.GetAbilityByName(
			"special_bonus_unique_skywrath_4"
		)
		if (talent !== undefined && talent.Level !== 0)
			return Number.MAX_SAFE_INTEGER
		return super.GetCastRangeForLevel(level)
	}
	public GetAOERadiusForLevel(level: number): number {
		const talent = this.Owner?.GetAbilityByName(
			"special_bonus_unique_skywrath_4"
		)
		if (talent !== undefined && talent.Level !== 0)
			return Number.MAX_SAFE_INTEGER
		return this.GetSpecialValue("launch_radius", level)
	}
}
