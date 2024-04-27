import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_weaver_swarm_debuff extends Modifier {
	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusArmor = 0
		this.isEmited = false
		return true
	}

	public OnIntervalThink(): void {
		this.SetBonusArmor()
	}

	public SetBonusArmor(specialName = "armor_reduction", _subtract = false): void {
		// const tick = 1 / 30 // 0.033
		const reduction = this.GetSpecialValue(specialName)
		const attackRate = this.GetSpecialValue("attack_rate")
		this.BonusArmor = -(1 + (this.ElapsedTime / attackRate) * reduction)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
