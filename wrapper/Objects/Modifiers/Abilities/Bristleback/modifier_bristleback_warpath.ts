import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_bristleback_warpath extends Modifier implements IBuff {
	public CachedMoveSpeed = 0
	public CachedBonusDamage = 0
	public readonly BuffModifierName = this.Name

	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
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

	public IsBuff(): this is IBuff {
		return true
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.CachedBonusDamage * this.StackCount, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed * this.StackCount, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.CachedMoveSpeed * this.StackCount, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_warpath"
		this.CachedMoveSpeed = this.GetSpecialValue("move_speed_per_stack", name)
		this.cachedAttackSpeed = this.GetSpecialValue("aspd_per_stack", name)
		this.CachedBonusDamage = this.GetSpecialValue("damage_per_stack", name)
	}
}
