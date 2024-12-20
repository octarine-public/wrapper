import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_mirana_selemenes_faithful extends Modifier {
	private cachedLotusHeal = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_LOTUS_HEAL,
			this.GetBonusLotusHeal.bind(this)
		]
	])

	protected GetBonusLotusHeal(): [number, boolean] {
		return [this.cachedLotusHeal, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedLotusHeal = this.GetSpecialValue(
			"bonus_lotus",
			"mirana_selemenes_faithful"
		)
	}
}
