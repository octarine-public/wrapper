import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_beastmaster_inner_beast extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMres = 0
	private cachedDamage = 0
	private cachedASPerUnit = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public get ForceVisible(): boolean {
		return !(this.Caster?.IsVisible ?? false)
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, this.IsPassiveDisabled(this.Caster)]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		let value = this.cachedAttackSpeed
		if (this.NetworkDamage !== 0) {
			value += this.cachedASPerUnit * this.NetworkDamage
		}
		return [value, this.IsPassiveDisabled(this.Caster)]
	}
	protected UpdateSpecialValues(): void {
		const name = "beastmaster_inner_beast"
		this.cachedMres = this.GetSpecialValue("magic_resist", name)
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
		this.cachedASPerUnit = this.GetSpecialValue("attack_speed_per_unit", name)
	}
}
