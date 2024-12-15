import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_flame_cloak extends Modifier {
	private cachedMres = 0
	private cachedVisualZDelta = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	public get DeltaZ(): number {
		return this.cachedVisualZDelta
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "lina_flame_cloak"
		this.cachedMres = this.GetSpecialValue("magic_resistance", name)
		this.cachedVisualZDelta = this.GetSpecialValue("visualzdelta", name)
	}
}
