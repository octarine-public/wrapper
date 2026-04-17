import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_partisans_brand extends Modifier {
	private cachedOutgoingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		]
	])
	protected GetDamageOutgoingPercentage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex(params.SourceIndex)
		if (target === undefined || target === this.Parent) {
			return [0, false]
		}
		if (!target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.cachedOutgoingDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedOutgoingDamage = this.GetSpecialValue(
			"bonus_damage_pct",
			"item_partisans_brand"
		)
	}
}
