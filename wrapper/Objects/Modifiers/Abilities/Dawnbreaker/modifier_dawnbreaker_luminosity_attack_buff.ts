import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_dawnbreaker_luminosity_attack_buff
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedOutgoingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		]
	])

	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}

	protected GetCriticalStrikeBonus(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled() || this.IsSuppressCrit()) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (owner === undefined || target === undefined || target.IsBuilding) {
			return [0, false]
		}
		return [this.cachedOutgoingDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedOutgoingDamage = this.GetSpecialValue(
			"bonus_damage",
			"dawnbreaker_luminosity"
		)
	}
}
