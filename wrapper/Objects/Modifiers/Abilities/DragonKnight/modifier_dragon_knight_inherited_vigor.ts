import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dragon_knight_inherited_vigor extends Modifier {
	public readonly IsBuff = true
	public readonly IsHidden = true

	private get hasDragonForm() {
		return this.Caster?.HasBuffByName("modifier_dragon_knight_dragon_form") ?? false
	}

	public OnUnitStateChaged() {
		this.SetBonusArmor()
	}

	protected SetBonusArmor(specialName = "base_armor", subtract = false) {
		super.SetBonusArmor(specialName, subtract)
	}

	protected GetSpecialValue(specialName: string, level?: number): number {
		if (specialName !== "base_armor") {
			return super.GetSpecialValue(specialName, level)
		}
		const owner = this.Parent
		if (owner === undefined) {
			return 0
		}
		const armorPerLevel = owner.Level * super.GetSpecialValue("level_mult")
		const specialValue = super.GetSpecialValue(specialName, level) + armorPerLevel
		if (!this.hasDragonForm) {
			return specialValue
		}
		const multiplierForm = super.GetSpecialValue(
			"regen_and_armor_multiplier_during_dragon_form"
		)
		return specialValue * multiplierForm
	}
}
