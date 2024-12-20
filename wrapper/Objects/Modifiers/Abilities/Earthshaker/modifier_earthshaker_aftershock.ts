import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_earthshaker_aftershock extends Modifier {
	private cachedInterval = 0
	private cachedDamage = 0
	private cachedIntervalPerLevel = 0

	public get AOEDamage() {
		return !this.IsPassiveDisabled() ? this.cachedDamage : 0
	}

	public get AOERadiusBonus() {
		const owner = this.Parent
		if (owner === undefined || this.IsPassiveDisabled()) {
			return 0
		}
		return Math.floor(owner.Level / this.cachedInterval) * this.cachedIntervalPerLevel
	}

	protected UpdateSpecialValues(): void {
		const name = "earthshaker_aftershock"
		this.cachedDamage = this.GetSpecialValue("aftershock_damage", name)
		this.cachedInterval = this.GetSpecialValue(
			"aftershock_range_level_interval",
			name
		)
		this.cachedIntervalPerLevel = this.GetSpecialValue(
			"aftershock_range_increase_per_level_interval",
			name
		)
	}
}
