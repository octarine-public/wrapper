import { WrapperClassModifier } from "../../../Decorators"
import { ModifierManager } from "../../../Managers/ModifierManager"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_guardian_greaves_aura extends Modifier {
	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetBonusArmor()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusArmor = 0
		this.isEmited = false
		return true
	}

	protected SetBonusArmor(specialName = "aura_armor", subtract = false): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.BonusArmor = 0
			return
		}
		const treshold = this.GetSpecialValue("aura_bonus_threshold")
		if (owner.HPPercent < treshold) {
			specialName += "_bonus"
		}
		super.SetBonusArmor(specialName, subtract)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
