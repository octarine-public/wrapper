import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nyx_assassin_vendetta extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedRange = 0
	private cachedDamage = 0
	private cachedSpeedValue = 0
	private cachedSpeedBonusValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetBonusAttackRange.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
			this.GetPreAttackBonusDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public PostDataUpdate(): void {
		if (this.cachedSpeedValue === 0) {
			return
		}
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = this.cachedSpeedValue
			return
		}
		if (!owner.HasBuffByName("modifier_nyx_assassin_vendetta_fast")) {
			this.cachedSpeed = this.cachedSpeedValue
			return
		}
		this.cachedSpeed = this.cachedSpeedValue + this.cachedSpeedBonusValue
	}
	protected GetBonusAttackRange(): [number, boolean] {
		return [this.cachedRange, false]
	}
	protected GetPreAttackBonusDamagePure(): [number, boolean] {
		return [this.cachedDamage, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "nyx_assassin_vendetta"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedRange = this.GetSpecialValue("attack_range_bonus", name)
		this.cachedSpeedValue = this.GetSpecialValue("movement_speed", name)
		this.cachedSpeedBonusValue = this.GetSpecialValue(
			"free_pathing_movement_speed_bonus",
			name
		)
	}
}
