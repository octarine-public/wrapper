import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_obsidian_destroyer_equilibrium extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [((this.Parent?.Mana ?? 0) * this.cachedSpeed) / 100, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedSpeed = this.GetSpecialValue(
			"mana_as_ms",
			"obsidian_destroyer_equilibrium"
		)
	}
}
