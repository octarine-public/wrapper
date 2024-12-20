import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_venomancer_noxious_plague_slow extends Modifier implements IDebuff {
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedRadius = 0
	private cachedSpeedMin = 0
	private cachedSpeedMax = 0
	private cachedAttackSpeed = 0

	protected readonly CanPostDataUpdate = true
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

	public IsDebuff(): this is IDebuff {
		return true
	}

	public PostDataUpdate(): void {
		const owner = this.Parent,
			auraOwner = this.AuraOwner,
			min = -this.cachedSpeedMin,
			max = -this.cachedSpeedMax
		if (owner === undefined || auraOwner === undefined) {
			this.cachedSpeed = 0
			return
		}
		if (owner === auraOwner) {
			this.cachedSpeed = max
			return
		}
		const distance = 1 - owner.Distance2D(auraOwner) / this.cachedRadius
		this.cachedSpeed = Math.min(min, distance * max)
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [-this.cachedAttackSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "venomancer_noxious_plague"
		this.cachedRadius = this.GetSpecialValue("debuff_radius", name)
		this.cachedSpeedMin = this.GetSpecialValue("movement_slow_min", name)
		this.cachedSpeedMax = this.GetSpecialValue("movement_slow_max", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_slow", name)
	}
}
