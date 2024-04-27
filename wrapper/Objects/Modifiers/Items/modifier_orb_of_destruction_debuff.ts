import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_orb_of_destruction_debuff extends Modifier {
	// because it's neutral tier without SpellImmunityType
	// SPELL_IMMUNITY_ENEMIES_YES
	public readonly IsDebuff = true

	protected SetBonusArmor(specialName = "armor_reduction", subtract = true): void {
		super.SetBonusArmor(specialName, subtract)
	}

	protected SetMoveSpeedAmplifier(_specialName?: string, subtract = true): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const specialName = `slow_${owner.IsRanged ? "range" : "melee"}`
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
