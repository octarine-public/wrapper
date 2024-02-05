import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rattletrap_overclocking extends Modifier {
	private isEmited = false

	public OnIntervalThink(): void {
		this.SetBonusAttackSpeed()
	}

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusAttackSpeed = 0
		return true
	}

	protected SetBonusAttackSpeed(
		specialName = "bonus_attack_speed",
		subtract = false
	): void {
		if (!this.hasSelfBonuses()) {
			this.BonusAttackSpeed = 0
			return
		}
		super.SetBonusAttackSpeed(specialName, subtract)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThinkTemporary(this)
		}
	}

	private hasSelfBonuses() {
		return this.Parent?.HasBuffByName("modifier_rattletrap_cog_self_bonuses") ?? false
	}
}
