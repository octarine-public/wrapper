import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_unrelenting_eye extends Modifier {
	private cachedSlowPerHero = 0
	private cachedMaxSlowResist = 0
	private cachedMaxStatusResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])
	protected GetSlowResistanceStacking(): [number, boolean] {
		const perHero = this.cachedSlowPerHero * this.NetworkDamage
		return [this.cachedMaxSlowResist - perHero, false]
	}
	protected GetStatusResistanceStacking(): [number, boolean] {
		const perHero = this.cachedMaxStatusResist * this.NetworkDamage
		return [perHero, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_unrelenting_eye"
		this.cachedSlowPerHero = this.GetSpecialValue("hero_reduction", name)
		this.cachedMaxSlowResist = this.GetSpecialValue("max_slow_res", name)
		this.cachedMaxStatusResist = this.GetSpecialValue(
			"status_res_pct_increase_per_hero",
			name
		)
	}
}
