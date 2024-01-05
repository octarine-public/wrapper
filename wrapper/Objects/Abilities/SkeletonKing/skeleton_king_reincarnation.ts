import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skeleton_king_reincarnation")
export class skeleton_king_reincarnation extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue(
			this.Owner?.HasScepter ? "aura_radius" : "slow_radius",
			level
		)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
	/**
	 * @param level
	 * @return {number}
	 */
	public GetBaseManaCostForLevel(level: number): number {
		return this.GetSpecialValue("AbilityManaCost", level)
	}
}
