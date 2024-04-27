import { WrapperClassModifier } from "../../../Decorators"
import { ModifierManager } from "../../../Managers/ModifierManager"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_spark_of_courage extends Modifier {
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

	protected SetBonusArmor(specialName = "armor", _subtract = false): void {
		let armor = 0
		const owner = this.Parent
		if (owner === undefined) {
			this.BonusArmor = armor
			return
		}
		const treshold = this.GetSpecialValue("health_pct")
		if (owner.HPPercent < treshold) {
			armor = this.GetSpecialValue(specialName)
		}
		this.BonusArmor = armor
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThink(this)
		}
	}
}
