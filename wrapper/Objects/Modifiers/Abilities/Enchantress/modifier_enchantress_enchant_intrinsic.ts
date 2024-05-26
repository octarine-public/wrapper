import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_enchantress_enchant_intrinsic extends Modifier {
	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusAttackRange = 0
		this.isEmited = false
		return true
	}

	public OnIntervalThink(): void {
		this.SetBonusAttackRange()
	}

	protected SetBonusAttackRange(
		specialName = "attack_range_bonus",
		subtract = false
	): void {
		const caster = this.Caster
		if (caster === undefined || caster.Target === undefined) {
			this.BonusAttackRange = 0
			return
		}
		const hasSlow = caster.Target.HasBuffByName("modifier_enchantress_enchant_slow")
		if (!caster.IsAttacking || !hasSlow) {
			this.BonusAttackRange = 0
			return
		}
		super.SetBonusAttackRange(specialName, subtract)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
