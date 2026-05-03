import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { ISpecialValueOptions } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_bristleback_prickly extends Modifier {
	private cachedAngle = 0
	private cachedOutgoingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		]
	])

	protected GetDamageOutgoingPercentage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex(params.SourceIndex)
		if (owner === undefined || target === undefined) {
			return [0, false]
		}
		const angle = -owner.GetSourceAngleToForward(target, false, owner.Position)
		return angle > Math.cos(this.cachedAngle)
			? [this.cachedOutgoingDamage, false]
			: [0, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "bristleback_prickly"
		this.cachedOutgoingDamage = this.GetSpecialValue("amp_pct", name)
		this.cachedAngle = Math.degreesToRadian(this.GetSpecialValue("angle", name))
	}

	protected GetSpecialValue(
		specialName: string,
		abilityName: string,
		level = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1),
		optional?: ISpecialValueOptions
	): number {
		switch (specialName) {
			case "amp_pct":
				return super.GetSpecialValue(specialName, abilityName, level, {
					lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD }
				})
			default:
				return super.GetSpecialValue(specialName, abilityName, level, optional)
		}
	}
}
