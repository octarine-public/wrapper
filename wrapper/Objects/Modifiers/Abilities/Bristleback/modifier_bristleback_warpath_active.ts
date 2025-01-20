import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { modifier_bristleback_warpath } from "./modifier_bristleback_warpath"

@WrapperClassModifier()
export class modifier_bristleback_warpath_active extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedBonusDamage = 0
	private cachedSpeedOffset = 0
	private cachedAttackOffset = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = 0
			return
		}
		const modifier = owner.GetBuffByClass(modifier_bristleback_warpath)
		if (modifier === undefined) {
			this.cachedSpeed = 0
			return
		}
		const halfSpeed = (100 - this.cachedSpeedOffset) / 100,
			halfDmg = (100 - this.cachedAttackOffset) / 100,
			stackCount = modifier.StackCount

		this.cachedSpeed = modifier.CachedMoveSpeed * stackCount * halfSpeed
		this.cachedBonusDamage = modifier.CachedBonusDamage * stackCount * halfDmg
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedBonusDamage, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_warpath"
		this.cachedSpeedOffset = this.GetSpecialValue(
			"active_bonus_movement_percent",
			name
		)
		this.cachedAttackOffset = this.GetSpecialValue(
			"active_bonus_attack_percent",
			name
		)
	}
}
