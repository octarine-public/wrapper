import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_templar_assassin_trap_slow extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private speedMin = 0
	private speedMax = 0
	private chargeMaxDuration = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const ratio = Math.min(1, this.NetworkFadeTime / this.chargeMaxDuration)
		const value = Math.floor(this.speedMin + (this.speedMax - this.speedMin) * ratio)
		return [-value, this.IsMagicImmune()]
	}
	protected UpdateSpecialValues(): void {
		const name = "templar_assassin_psionic_trap"
		this.speedMin = this.GetSpecialValue("movement_speed_min", name)
		this.speedMax = this.GetSpecialValue("movement_speed_max", name)
		this.chargeMaxDuration = this.GetSpecialValue("trap_max_charge_duration", name)
	}
}
