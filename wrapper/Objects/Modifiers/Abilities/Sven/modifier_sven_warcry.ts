import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_sven_warcry extends Modifier {
	public Update(): void {
		super.Update()
		if (!this.IsShield) {
			this.IsShield = this.NetworkFadeTime !== 0
		}
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.IsShield = false
		return true
	}

	protected SetBonusArmor(specialName = "bonus_armor", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
	public SetMoveSpeedAmplifier(specialName = "movespeed", subtract = false): void {
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}
}
