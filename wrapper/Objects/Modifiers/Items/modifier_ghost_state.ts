import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ghost_state extends Modifier {
	public readonly IsGhost = true

	private cachedMres = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
			this.GetMagicalResistanceDecrepifyUnique.bind(this)
		]
	])

	protected GetMagicalResistanceDecrepifyUnique(): [number, boolean] {
		return [this.cachedMres, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedMres = this.GetSpecialValue("extra_spell_damage_percent", "item_ghost")
	}
}
