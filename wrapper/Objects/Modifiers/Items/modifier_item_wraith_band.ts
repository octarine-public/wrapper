import { WrapperClassModifier } from "../../../Decorators"
import { GameState } from "../../../Imports"
import { ModifierManager } from "../../../Managers/ModifierManager"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_wraith_band extends Modifier {
	public readonly BonusAttackSpeedStack = true

	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetBonusAttackSpeed()
	}

	protected SetBonusAttackSpeed(specialName = "bonus_attack_speed", subtract = false) {
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	protected GetSpecialValue(specialName: string, level: number): number {
		const time = GameState.RawGameTime / 60
		if (time >= super.GetSpecialValue("clock_time", level)) {
			return super.GetSpecialValue(specialName, level + 1)
		}
		return super.GetSpecialValue(specialName, level)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
