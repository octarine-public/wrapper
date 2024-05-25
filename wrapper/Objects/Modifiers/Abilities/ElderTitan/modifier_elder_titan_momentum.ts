import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_elder_titan_momentum extends Modifier {
	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BaseBonusAttackSpeed = 0
		this.isEmited = false
		return true
	}

	public OnIntervalThink(): void {
		this.SetBaseBonusAttackSpeed()
	}

	protected SetBaseBonusAttackSpeed(
		specialName = "attack_speed_penalty",
		_subtract = true
	): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.BaseBonusAttackSpeed = 0
			return
		}
		const penalty = this.GetSpecialValue(specialName)
		const bonusFraction = this.GetSpecialValue("attack_speed_from_movespeed") / 100
		this.BaseBonusAttackSpeed = owner.Speed * bonusFraction - penalty
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
