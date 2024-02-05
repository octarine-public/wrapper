import { WrapperClassModifier } from "../../../../Decorators"
import { BrawlActive } from "../../../../Enums/BrawlActive"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { brewmaster_drunken_brawler } from "../../../Abilities/Brewmaster/brewmaster_drunken_brawler"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_drunken_brawler_passive extends Modifier {
	public readonly IsHidden = true

	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetBonusAttackSpeed()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusAttackSpeed = 0
		return true
	}

	protected SetBonusAttackSpeed(specialName = "attack_speed", subtract = false): void {
		const brawlActive = (this.Ability as Nullable<brewmaster_drunken_brawler>)
			?.BrawlActive

		if (brawlActive === undefined) {
			this.BonusAttackSpeed = 0
			return
		}

		switch (brawlActive) {
			case BrawlActive.FIRE_FIGHTER:
				super.SetBonusAttackSpeed(specialName, subtract)
				break
			default:
				this.BonusAttackSpeed = 0
				break
		}
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
