import { GetSpellTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_antimage_empowered_mana_break extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public CachedBonusManaBurn = 0

	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(): string {
		return GetSpellTexture("antimage_mana_break")
	}
	protected UpdateSpecialValues() {
		this.CachedBonusManaBurn = this.GetSpecialValue(
			"empowered_max_burn_pct_tooltip",
			"antimage_blink"
		)
	}
}
