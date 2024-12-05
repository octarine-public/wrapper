import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_tidehunter_kraken_shell extends Modifier {
	private cachedBlockDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
			this.GetPhysicalConstantBlock.bind(this)
		]
	])

	protected GetPhysicalConstantBlock(): [number, boolean] {
		return [this.cachedBlockDamage + this.StackCount, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedBlockDamage = this.GetSpecialValue(
			"damage_reduction",
			"tidehunter_kraken_shell"
		)
	}
}
