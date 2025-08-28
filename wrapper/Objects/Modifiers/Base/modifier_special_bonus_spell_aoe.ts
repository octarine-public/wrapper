import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_special_bonus_spell_aoe extends Modifier {
	private cachedAOE = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			this.GetAoeBonusConstantStacking.bind(this)
		]
	])
	protected GetAoeBonusConstantStacking(): [number, boolean] {
		return [this.cachedAOE, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedAOE = this.GetSpecialValue("value", this.CachedAbilityName ?? "")
	}
}
