import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_unrelenting_eye extends Modifier {
	private cachedSlowPerHero = 0
	private cachedMaxSlowResist = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING,
			this.GetSlowResistanceStacking.bind(this)
		]
	])
	protected GetSlowResistanceStacking(): [number, boolean] {
		const perHero = this.cachedSlowPerHero * this.NetworkDamage
		return [this.cachedMaxSlowResist - perHero, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_unrelenting_eye"
		this.cachedSlowPerHero = this.GetSpecialValue("hero_reduction", name)
		this.cachedMaxSlowResist = this.GetSpecialValue("max_slow_res", name)
	}
}
