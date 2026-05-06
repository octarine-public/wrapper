import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Creep } from "../../../Base/Creep"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_lycan_apex_predator extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])
	protected GetPreAttackBonusDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		const caster = this.Caster
		if (params === undefined || caster === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !(target instanceof Creep) || !target.IsNeutral) {
			return [0, false]
		}
		return [this.cachedDamage, this.IsPassiveDisabled(caster)]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"damage_amp",
			"lycan_apex_predator",
			Math.max(this.Ability?.Level ?? this.AbilityLevel, 1),
			{ lvlup: { operation: EDOTASpecialBonusOperation.SPECIAL_BONUS_ADD } }
		)
	}
}
