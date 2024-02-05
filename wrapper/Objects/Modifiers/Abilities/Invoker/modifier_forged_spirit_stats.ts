import { WrapperClassModifier } from "../../../../Decorators"
import { invoker_forge_spirit } from "../../../Abilities/Invoker/invoker_forge_spirit"
import { invoker_forge_spirit_ad } from "../../../Abilities/Invoker/invoker_forge_spirit_ad"
import { Ability } from "../../../Base/Ability"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_forged_spirit_stats extends Modifier {
	protected SetBonusAttackRange(
		specialName = "spirit_attack_range",
		subtract = false
	): void {
		super.SetBonusAttackRange(specialName, subtract)
	}

	protected SetBonusAttackSpeed(
		specialName = "spirit_attack_speed",
		subtract = false
	): void {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected GetSpecialValue(specialName: string, _level: number): number {
		const ability = this.Ability
		if (!this.shouldBeValidSpell(ability)) {
			return 0
		}
		let level = 0
		switch (specialName) {
			case "spirit_attack_range":
				level = Math.max(ability.QuasLevel + this.AbilityLevel, this.AbilityLevel)
				break
			case "spirit_attack_speed":
				level = Math.max(this.AbilityLevel, ability.Level)
				break
			default:
				break
		}
		return super.GetSpecialValue(specialName, level)
	}

	private shouldBeValidSpell(
		ability: Nullable<Ability>
	): ability is invoker_forge_spirit | invoker_forge_spirit_ad {
		return (
			ability instanceof invoker_forge_spirit ||
			ability instanceof invoker_forge_spirit_ad
		)
	}
}
