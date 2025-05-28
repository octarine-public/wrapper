import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_giant_maul extends Modifier {
	private cachedCastTime = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		]
	])
	protected GetCriticalStrikeBonus(params?: IModifierParams): [number, boolean] {
		if (!(this.Ability?.IsReady ?? false)) {
			return [0, false]
		}
		if (params === undefined || this.IsSuppressCrit()) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (owner === undefined || target === undefined || target.IsBuilding) {
			return [0, false]
		}
		return [this.cachedCastTime, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedCastTime = this.GetSpecialValue("crit_multiplier", "item_giant_maul")
	}
}
