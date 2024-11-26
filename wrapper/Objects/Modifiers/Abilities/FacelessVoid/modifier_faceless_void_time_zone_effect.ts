import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_faceless_void_time_zone_effect extends Modifier {
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
		const owner = this.Parent
		const caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		const isEnemy = owner.IsEnemy(caster),
			value = isEnemy ? -this.cachedSpeed : this.cachedSpeed
		return [value, false] // isEnemy && this.IsMagicImmune()
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		const owner = this.Parent
		const caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		const isEnemy = owner.IsEnemy(caster),
			value = isEnemy ? -this.cachedAttackSpeed : this.cachedAttackSpeed
		return [value, false] // isEnemy && this.IsMagicImmune()
	}

	protected UpdateSpecialValues(): void {
		const name = "faceless_void_time_zone"
		this.cachedSpeed = this.GetSpecialValue("bonus_move_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("bonus_attack_speed", name)
	}
}
