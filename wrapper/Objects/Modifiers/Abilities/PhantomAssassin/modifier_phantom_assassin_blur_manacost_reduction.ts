import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_phantom_assassin_blur_manacost_reduction
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedManaCostStacking = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
			this.GetManaCostPercentageStacking.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetManaCostPercentageStacking(): [number, boolean] {
		return [this.cachedManaCostStacking, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedManaCostStacking = this.GetSpecialValue(
			"manacost_reduction_after_blur_pct",
			"phantom_assassin_blur"
		)
	}
}
