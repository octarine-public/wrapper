import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nevermore_shadowraze_debuff extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0
	private cachedBonusDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public get BonusDamagePerStack(): number {
		return this.cachedBonusDamage * this.StackCount
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-(this.cachedAttackSpeed * this.StackCount), this.IsMagicImmune()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-(this.cachedSpeed * this.StackCount), this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = this.CachedAbilityName ?? ""
		this.cachedSpeed = this.GetSpecialValue("movement_speed_debuff", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_debuff", name)
		this.cachedBonusDamage = this.GetSpecialValue("stack_bonus_damage", name)
	}
}
