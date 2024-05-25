import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nevermore_presence extends Modifier {
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

	protected SetBonusArmor(specialName = "presence_armor_reduction", _subtract = false) {
		const caster = this.Caster,
			ability = this.Ability
		const reduction = this.GetSpecialValue(specialName)
		if (caster === undefined || ability === undefined) {
			this.BonusArmor = reduction
			return
		}
		const aura = caster.GetBuffByName("modifier_nevermore_presence_aura")
		if (aura === undefined) {
			this.BonusArmor = reduction
			return
		}
		const perStack = this.GetSpecialValue("bonus_armor_per_stack")
		const incPerStack = perStack * Math.max(aura.StackCount, 0) * -1
		this.BonusArmor = incPerStack + reduction
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
