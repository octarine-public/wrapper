import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_beastmaster_inner_beast extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

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
	public get ForceVisible(): boolean {
		return !(this.Caster?.IsVisible ?? false)
	}
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, this.IsPassiveDisabled(this.Caster)]
	}
	protected UpdateSpecialValues(): void {
		const name = "beastmaster_inner_beast",
			lvl = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name, lvl, {
			lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD }
		})
	}
}
