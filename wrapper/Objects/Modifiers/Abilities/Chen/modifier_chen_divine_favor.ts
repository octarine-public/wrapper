import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_chen_divine_favor extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedHPRegen = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
			this.GetHealthRegenConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetHealthRegenConstant(): [number, boolean] {
		return [this.cachedHPRegen, false]
	}
	protected UpdateSpecialValues() {
		this.cachedHPRegen = this.GetSpecialValue("heal_rate", "chen_divine_favor")
	}
}
