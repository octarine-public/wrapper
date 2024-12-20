import { ModifierParams } from "../../../../Base/ModifierParams"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_juggernaut_duelist extends Modifier {
	private cachedFrontAngle = 0
	private cachedOutgoingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_MULTIPLICATIVE,
			this.GetDamageOutgoingPercentageMultiplicative.bind(this)
		]
	])

	protected GetDamageOutgoingPercentageMultiplicative(
		modifierParams?: ModifierParams
	): [number, boolean] {
		if (modifierParams === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex(modifierParams.TargetIndex)
		if (owner === undefined || target === undefined) {
			return [0, false]
		}
		if (target.GetAngle(owner.Position) >= this.cachedFrontAngle) {
			return [0, false]
		}
		return [this.cachedOutgoingDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "juggernaut_duelist"
		this.cachedOutgoingDamage = this.GetSpecialValue("front_damage_increase", name)
		this.cachedFrontAngle = Math.degreesToRadian(
			this.GetSpecialValue("front_angle", name)
		)
	}
}
