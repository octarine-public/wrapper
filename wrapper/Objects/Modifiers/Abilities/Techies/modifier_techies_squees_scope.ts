import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_techies_squees_scope extends Modifier {
	private isEmited = false

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusAttackRange = 0
		this.isEmited = false
		return true
	}

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetBonusAttackRange()
	}

	protected SetBonusAttackRange(
		_specialName = "attack_range_tooltip",
		_subtract = false
	): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.BonusAttackRange = 0
			return
		}
		// const value = this.GetSpecialValue(specialName)
		const attackSpeed = owner.AttackSpeed
		this.BonusAttackRange = attackSpeed
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
