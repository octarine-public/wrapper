import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lamp_on extends Modifier {
	private cachedRange = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION,
			this.GetReductionVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetReductionVision.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			this.cachedRange = 0
			return
		}
		const modifier = caster.GetBuffByName("modifier_watcher_buff"),
			ability = modifier?.Ability
		if (modifier === undefined || ability === undefined) {
			this.cachedRange = 0
			return
		}
		this.cachedRange = ability.GetSpecialValue("bonus_vision")
	}

	protected GetReductionVision(): [number, boolean] {
		return [this.cachedRange, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedRange, false]
	}
}
