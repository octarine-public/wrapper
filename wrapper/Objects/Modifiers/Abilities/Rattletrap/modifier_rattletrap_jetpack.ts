import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rattletrap_jetpack extends Modifier {
	private cachedSpeed = 0
	private cachedSpeedValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DISABLE_TURNING,
			this.GetDisableTurning.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined || !owner.HasScepter) {
			this.cachedSpeed = this.cachedSpeedValue
			return
		}
		const modifier = owner.GetBuffByName("modifier_rattletrap_overclocking")
		if (modifier === undefined) {
			this.cachedSpeed = this.cachedSpeedValue
			return
		}
		const ability = modifier.Ability
		if (ability === undefined || ability.IsHidden) {
			this.cachedSpeed = this.cachedSpeedValue
			return
		}
		this.cachedSpeed = ability.GetSpecialValue("jetpack_bonus_speed")
	}

	protected GetDisableTurning(): [number, boolean] {
		return [1, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeedValue = this.GetSpecialValue("bonus_speed", "rattletrap_jetpack")
	}
}
