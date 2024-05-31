import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("grimstroke_return")
export class grimstroke_return extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const ability = owner.GetAbilityByName("grimstroke_spirit_walk")
		return ability?.GetBaseAOERadiusForLevel(level) ?? 0
	}
}
