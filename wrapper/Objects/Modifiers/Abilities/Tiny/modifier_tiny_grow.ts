import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tiny_grow extends Modifier {
	private cachedSpeed = 0
	private cachedArmor = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE,
			this.GetAttackSpeedPercenage.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}

	protected GetAttackSpeedPercenage(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeed, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		const name = "tiny_grow"
		this.cachedSpeed = this.GetSpecialValue("move_speed", name)
		this.cachedArmor = this.GetSpecialValue("bonus_armor", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_reduction", name)
	}
}
