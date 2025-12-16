import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { ISpecialValueOptions } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_luna_lunar_blessing extends Modifier {
	private cachedVision = 0
	private cachedVisionPerLevel = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		]
	])
	protected GetBonusNightVision(): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined) {
			return [0, false]
		}
		const bonusPerLevel = this.cachedVisionPerLevel * owner.Level
		return [this.cachedVision + bonusPerLevel, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedVision = this.GetSpecialValue(
			"bonus_night_vision",
			"luna_lunar_blessing"
		)
	}
	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1),
		_optional?: ISpecialValueOptions
	): number {
		return super.GetSpecialValue(specialName, abilityName, level, {
			lvlup: {
				operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD
			}
		})
	}
}
