import { WrapperClassModifier } from "../../../../Decorators"
import { invoker_alacrity } from "../../../Abilities/Invoker/invoker_alacrity"
import { invoker_alacrity_ad } from "../../../Abilities/Invoker/invoker_alacrity_ad"
import { Ability } from "../../../Base/Ability"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_alacrity extends Modifier {
	public readonly IsBuff = true

	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected GetSpecialValue(specialName: string, _level: number): number {
		const ability = this.Ability
		if (!this.shouldBeValidSpell(ability)) {
			return 0
		}
		const level = Math.max(ability.WexLevel + this.AbilityLevel, this.AbilityLevel)
		return super.GetSpecialValue(specialName, level)
	}

	private shouldBeValidSpell(
		ability: Nullable<Ability>
	): ability is invoker_alacrity | invoker_alacrity_ad {
		return (
			ability instanceof invoker_alacrity || ability instanceof invoker_alacrity_ad
		)
	}
}
