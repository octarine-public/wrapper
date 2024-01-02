import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("skeleton_king_reincarnation")
export class skeleton_king_reincarnation extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue(
			this.Owner?.HasScepter ? "aura_radius" : "slow_radius",
			level
		)
	}
	public GetMaxCooldownForLevel(level: number): number {
		return this.GetSpecialValue("AbilityCooldown", level)
	}
}
