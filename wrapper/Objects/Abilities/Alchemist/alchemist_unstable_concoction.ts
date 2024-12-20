import { WrapperClass } from "../../../Decorators"
import { modifier_alchemist_unstable_concoction } from "../../../Objects/Modifiers/Abilities/Alchemist/modifier_alchemist_unstable_concoction"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("alchemist_unstable_concoction")
export class alchemist_unstable_concoction extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetRawDamage(_target: Unit): number {
		const modifier = this.Owner?.GetBuffByClass(
			modifier_alchemist_unstable_concoction
		)
		return modifier?.RemainingDamage ?? 0
	}
}
