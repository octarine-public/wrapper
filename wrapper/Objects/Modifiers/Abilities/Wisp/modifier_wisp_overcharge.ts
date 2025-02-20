import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wisp_overcharge extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMres = 0
	private cachedArmor = 0
	private cachedAttackSpeed = 0
	private cachedSpellAmplify = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmplifyPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected GetSpellAmplifyPercentage(): [number, boolean] {
		return [this.cachedSpellAmplify, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "wisp_overcharge"
		this.cachedMres = this.GetSpecialValue("bonus_mres", name)
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		this.cachedSpellAmplify = this.GetSpecialValue("bonus_spell_amp", name)
	}
}
