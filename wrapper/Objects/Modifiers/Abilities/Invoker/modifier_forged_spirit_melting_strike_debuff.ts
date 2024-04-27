import { WrapperClassModifier } from "../../../../Decorators"
import { forged_spirit_melting_strike } from "../../../Abilities/ForgedSpirit/forged_spirit_melting_strike"
import { Ability } from "../../../Base/Ability"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_forged_spirit_melting_strike_debuff extends Modifier {
	protected SetBonusArmor(specialName = "armor_removed", _subtract = true): void {
		const maxStackCount = this.GetSpecialValue("max_armor_removed")
		const value = this.GetSpecialArmorByState(specialName)
		this.BonusArmor = -(value * Math.min(Math.max(this.StackCount, 0), maxStackCount))
	}

	protected GetSpecialValue(specialName: string, level = this.AbilityLevel): number {
		const ability = this.Ability
		if (!this.shouldBeValidSpell(ability)) {
			return 0
		}
		switch (specialName) {
			case "armor_removed":
				level = Math.max(ability.ExortLevel + level, level)
				break
		}
		return super.GetSpecialValue(specialName, level)
	}

	private shouldBeValidSpell(
		ability: Nullable<Ability>
	): ability is forged_spirit_melting_strike {
		return ability instanceof forged_spirit_melting_strike
	}
}
