import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("legion_commander_overwhelming_odds")
export class legion_commander_overwhelming_odds extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		const owner = this.Owner
		const radius = this.GetSpecialValue("radius", level)
		if (owner === undefined) {
			return radius
		}
		return owner.HasBuffByName("modifier_legion_commander_duel")
			? this.GetSpecialValue("duel_radius_bonus") + radius
			: radius
	}

	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
