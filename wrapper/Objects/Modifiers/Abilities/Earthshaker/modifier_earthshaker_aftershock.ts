import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_earthshaker_aftershock extends Modifier {
	protected readonly CanPostDataUpdate: boolean = true

	private cachedDamage = 0
	private cachedEchoLevel = 0
	private cachedIntervalPerLevel = 0

	public get AOEDamage() {
		return !this.IsPassiveDisabled() ? this.cachedDamage : 0
	}
	public get AOERadiusBonus() {
		return Math.floor(this.cachedEchoLevel * this.cachedIntervalPerLevel)
	}
	public PostDataUpdate(): void {
		this.updateLevelEchoSlam()
	}
	protected UpdateSpecialValues(): void {
		const name = "earthshaker_aftershock"
		this.updateLevelEchoSlam()
		this.cachedDamage = this.GetSpecialValue("aftershock_damage", name)
		this.cachedIntervalPerLevel = this.GetSpecialValue(
			"aftershock_range_increase_per_level_interval",
			name
		)
	}
	private updateLevelEchoSlam(): void {
		this.cachedEchoLevel =
			this.Parent?.GetAbilityByName("earthshaker_echo_slam")?.Level ?? 0
	}
}
