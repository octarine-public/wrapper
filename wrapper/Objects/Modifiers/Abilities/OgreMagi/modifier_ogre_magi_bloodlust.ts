import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ogre_magi_bloodlust extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0
	private cachedAttackSpeedSelf = 0

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
		return [this.cachedSpeed, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return this.Parent === this.Caster
			? [this.cachedAttackSpeedSelf, false]
			: [this.cachedAttackSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "ogre_magi_bloodlust"
		this.cachedSpeed = this.GetSpecialValue("bonus_movement_speed", name)
		this.cachedAttackSpeedSelf = this.GetSpecialValue("self_bonus", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
