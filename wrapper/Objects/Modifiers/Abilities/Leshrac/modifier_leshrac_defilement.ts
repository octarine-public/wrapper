import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_leshrac_defilement extends Modifier {
	private cachedAOEPerInt = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_AOE_BONUS_CONSTANT_STACKING,
			this.GetAoeBonusConstantStacking.bind(this)
		]
	])

	protected GetAoeBonusConstantStacking(): [number, boolean] {
		const totalInt = this.Parent?.TotalIntellect ?? 0
		return [totalInt * this.cachedAOEPerInt, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedAOEPerInt = this.GetSpecialValue("aoe_per_int", "leshrac_defilement")
	}
}
