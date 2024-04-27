import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { GameState } from "../../../../Utils/GameState"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_neutral_upgrade extends Modifier {
	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetBonusArmor()
		this.SetBonusAttackSpeed()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusArmor = 0
		this.BonusAttackSpeed = 0
		this.isEmited = false
		return true
	}

	protected SetBonusArmor(_specialName?: string, _subtract = false): void {
		this.BonusArmor = this.getIncreaseByTime("increase_armor")
	}

	protected SetBonusAttackSpeed(_specialName?: string, _subtract = false): void {
		this.BonusAttackSpeed = this.getIncreaseByTime("increase_aspd")
	}

	// see: https://dota2.fandom.com/wiki/Neutral_creeps
	private getIncreaseByTime(specialName: string): number {
		const currTime = GameState.RawGameTime
		const increaseTime = this.GetSpecialValue("increase_time")
		return Math.floor(currTime / increaseTime) * this.GetSpecialValue(specialName)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
