import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { invoker_spell_extends } from "../../../Abilities/Invoker/invoker_spell_extends"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_invoker_alacrity extends Modifier {
	private cachedDamage = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("bonus_damage")
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed")
	}

	protected GetSpecialValue(
		specialName: string,
		abilityName = "invoker_alacrity",
		_level?: number
	): number {
		const ability = this.Ability
		if (!(ability instanceof invoker_spell_extends)) {
			return 0
		}
		if (specialName === "bonus_damage") {
			return super.GetSpecialValue(specialName, abilityName, ability.ExortLevel)
		}
		if (specialName === "bonus_attack_speed") {
			return super.GetSpecialValue(specialName, abilityName, ability.WexLevel)
		}
		return 0
	}
}
