import { GetRuneTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rune_arcane extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])
	public get ForceVisible() {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return true
	}
	public GetTexturePath(small = false) {
		return GetRuneTexture("arcane", small)
	}
	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [30, false] // harcoded (add custom to keyvalues): (KeyValues(..., "cost_reduction_pct", 30))
	}
}
