import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_solar_crest_armor_addition extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0

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

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return this.Parent === this.Caster ? [0, false] : [this.cachedSpeed, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return this.Parent === this.Caster ? [0, false] : [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_solar_crest"
		this.cachedSpeed = this.GetSpecialValue("target_movement_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("target_attack_speed", name)
	}
}
