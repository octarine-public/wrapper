import { WrapperClassModifier } from "../../../../Decorators"
import { BrawlActive } from "../../../../Enums/BrawlActive"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { brewmaster_drunken_brawler } from "../../../Abilities/Brewmaster/brewmaster_drunken_brawler"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_drunken_brawler_passive extends Modifier {
	public readonly IsHidden = true
	private isEmited = false

	private get brawlActive() {
		return (this.Ability as Nullable<brewmaster_drunken_brawler>)?.BrawlActive
	}

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetBonusArmor()
		this.SetBonusAttackSpeed()
		this.SetStatusResistanceAmplifier()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusArmor = 0
		this.BonusAttackSpeed = 0
		this.StatusResistanceAmplifier = 0
		this.isEmited = false
		return true
	}

	protected SetBonusArmor(specialName = "armor", subtract = false): void {
		const brawlActive = this.brawlActive
		if (brawlActive === undefined) {
			this.BonusArmor = 0
			return
		}
		switch (brawlActive) {
			case BrawlActive.EARTH_FIGHTER:
				super.SetBonusArmor(specialName, subtract)
				break
			default:
				this.BonusArmor = 0
				break
		}
	}

	protected SetBonusAttackSpeed(specialName = "attack_speed", subtract = false): void {
		const brawlActive = this.brawlActive
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

	protected SetStatusResistanceAmplifier(
		specialName = "bonus_status_resist",
		_subtract = false
	): void {
		const brawlActive = this.brawlActive
		if (brawlActive === undefined) {
			this.StatusResistanceAmplifier = 0
			return
		}
		const value = this.GetSpecialValue(specialName)
		const hasBrewUp = this.Parent?.HasBuffByName("modifier_brewmaster_brew_up")
		switch (brawlActive) {
			case BrawlActive.VOID_FIGHTER:
				this.StatusResistanceAmplifier = (hasBrewUp ? value * 2 : value) / 100
				break
			default:
				this.StatusResistanceAmplifier = 0
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
