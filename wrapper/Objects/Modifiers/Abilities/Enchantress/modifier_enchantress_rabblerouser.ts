import { WrapperClassModifier } from "../../../../Decorators"
import { EDOTASpecialBonusOperation } from "../../../../Enums/EDOTASpecialBonusOperation"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"
import { ISpecialValueOptions } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_enchantress_rabblerouser extends Modifier {
	public readonly IsHidden = false
	public readonly IsGlobally = true

	private cachedOutBaseDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetOutgoingDamagePercentage.bind(this)
		]
	])

	private GetOutgoingDamagePercentage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled(this.Caster)) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.IsHero) {
			return [0, false]
		}
		if (target === this.Parent || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.cachedOutBaseDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedOutBaseDamage = this.GetSpecialValue(
			"damage_amp",
			"enchantress_rabblerouser"
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
