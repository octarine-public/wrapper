import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skywrath_mage_concussive_shot")
export class skywrath_mage_concussive_shot extends Ability {
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

	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("launch_radius", level)
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}

	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
}
