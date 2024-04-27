import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_huskar_berserkers_blood extends Modifier {
	public readonly IsBuff = true

	private isEmited = false

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusAttackSpeed = 0
		this.isEmited = false
		return true
	}

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetBonusAttackSpeed()
	}

	protected SetBonusAttackSpeed(_specialName?: string, _subtract = false): void {
		const owner = this.Parent
		if (owner === undefined || owner.IsIllusion) {
			this.BonusAttackSpeed = 0
			return
		}
		const maxAttackSpeed = this.GetSpecialAttackSpeedByState("maximum_attack_speed")
		this.BonusAttackSpeed = Math.max(this.calculateByHP(owner) * maxAttackSpeed, 0)
	}

	private calculateByHP(owner: Unit) {
		const exponent = 1.88
		const maxThreshold = this.GetSpecialValue("hp_threshold_max") / 100
		const hpThreshold = owner.HP / owner.MaxHP - maxThreshold
		const total = 1 - Math.max(hpThreshold / (1 - maxThreshold), 0)
		return Math.pow(total, exponent)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
