import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_infest_creep extends Modifier {
	private cachedSpeed = 0
	private cachedBaseSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE,
			this.GetMoveSpeedBaseOverride.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const caster = this.Caster
		if (caster === undefined) {
			return
		}
		const moveSpeed = caster.GetMoveSpeedModifier(caster.BaseMoveSpeed, true)
		this.cachedBaseSpeed = moveSpeed
	}

	protected GetMoveSpeedBaseOverride(): [number, boolean] {
		return [this.cachedBaseSpeed, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"bonus_movement_speed",
			"life_stealer_infest"
		)
	}
}
