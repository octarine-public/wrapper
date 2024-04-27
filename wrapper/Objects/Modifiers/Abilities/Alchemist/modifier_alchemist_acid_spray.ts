import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_alchemist_acid_spray extends Modifier {
	public readonly IsDebuff = true

	protected SetBonusArmor(specialName = "armor_reduction", subtract = true): void {
		super.SetBonusArmor(specialName, this.IsEnemy() ? subtract : !subtract)
	}

	protected GetSpecialArmorByState(specialName: string): number {
		const isEnemy = this.IsEnemy()
		const specialValue = super.GetSpecialArmorByState(specialName)
		if (isEnemy) {
			return specialValue
		}
		return this.GetSpecialValue("armor_allies") !== 0
			? this.GetSpecialValue(specialName)
			: 0
	}
}
