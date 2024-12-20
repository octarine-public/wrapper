import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lina_laguna_blade_barrier extends Modifier {
	public readonly HasVisualShield = true

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	protected GetTotalConstantBlock(_params?: IModifierParams): [number, boolean] {
		return [this.NetworkMovementSpeed, false]
	}
}
