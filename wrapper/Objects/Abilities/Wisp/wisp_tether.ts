import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("wisp_tether")
export class wisp_tether extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetMaxCooldownForLevel(level: number): number {
		let baseCooldown = super.GetMaxCooldownForLevel(level)
		const owner = this.Owner
		if (owner === undefined) {
			return baseCooldown
		}
		const talent = owner.GetAbilityByName("special_bonus_unique_wisp_6")
		if (talent !== undefined && talent.Level !== 0) {
			baseCooldown -= talent.GetSpecialValue("value", talent.Level)
		}
		return Math.max(baseCooldown, 0)
	}
}
