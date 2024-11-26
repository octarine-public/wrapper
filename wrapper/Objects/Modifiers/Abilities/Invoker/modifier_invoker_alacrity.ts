import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_spell_extends } from "../../../Abilities/Invoker/invoker_spell_extends"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_alacrity extends Modifier {
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAttackSpeed = this.GetSpecialValue()
	}

	protected GetSpecialValue(
		specialName = "bonus_attack_speed",
		abilityName = "invoker_alacrity",
		_level?: number
	): number {
		const ability = this.Ability
		if (!(ability instanceof invoker_spell_extends)) {
			return 0
		}
		return super.GetSpecialValue(specialName, abilityName, ability.WexLevel)
	}
}
