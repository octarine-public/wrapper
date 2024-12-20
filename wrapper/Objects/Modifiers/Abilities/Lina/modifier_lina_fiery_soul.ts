import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_fiery_soul extends Modifier {
	private cachedAS = 0
	private cachedMres = 0
	private cachedSpeed = 0
	private cachedSpellAmpDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public GetSpellBonusDamage(rawDamage: number): number {
		return rawDamage + this.cachedSpellAmpDamage * this.StackCount
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres * this.StackCount, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.StackCount, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAS * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "lina_fiery_soul"
		this.cachedMres = this.GetSpecialValue("fiery_soul_magic_resist", name)
		this.cachedAS = this.GetSpecialValue("fiery_soul_attack_speed_bonus", name)
		this.cachedSpeed = this.GetSpecialValue("fiery_soul_move_speed_bonus", name)
		this.cachedSpellAmpDamage = this.GetSpecialValue("bonus_spell_damage", name)
	}
}
