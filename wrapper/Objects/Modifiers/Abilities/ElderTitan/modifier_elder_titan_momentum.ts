import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_momentum extends Modifier {
	private cachedArmor = 0
	private cachedSpeedFromMS = 0
	private cachedAttackSpeed = 0
	private cachedSpeedFromArmor = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedArmor = 0
			this.cachedAttackSpeed = 0
			return
		}
		const speed = Math.max(owner.MoveSpeed - owner.BaseMoveSpeed, 0)
		this.cachedAttackSpeed = speed * (this.cachedSpeedFromMS / 100)
		this.cachedArmor = speed * (this.cachedSpeedFromArmor / 100)
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "elder_titan_momentum"
		this.cachedSpeedFromMS = this.GetSpecialValue("attack_speed_from_movespeed", name)
		this.cachedSpeedFromArmor = this.GetSpecialValue(
			"armor_from_movespeed",
			name,
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1),
			{ lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD } }
		)
	}
}
