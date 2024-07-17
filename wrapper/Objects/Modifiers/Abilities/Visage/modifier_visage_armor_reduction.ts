import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_armor_reduction extends Modifier {
	public readonly IsDebuff = true
	public readonly BonusArmorStack = true

	protected SetBonusArmor(
		specialName = "armor_reduction_per_hit",
		subtract = true
	): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
