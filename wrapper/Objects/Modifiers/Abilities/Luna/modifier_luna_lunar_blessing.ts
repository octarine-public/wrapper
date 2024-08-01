import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_luna_lunar_blessing extends Modifier {
	public SetBonusNightVision(
		specialName = "bonus_night_vision_self",
		subtract = false
	): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		const perLevelName = "bonus_night_vision_per_level"
		const selfBonus = this.GetSpecialValue(specialName)
		const bonusPerLevel = this.GetSpecialValue(perLevelName) * owner.Level
		this.BonusNightVision = (subtract ? selfBonus * -1 : selfBonus) + bonusPerLevel
	}
}
