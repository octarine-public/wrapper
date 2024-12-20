import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_furion_teleport_shield extends Modifier {
	public readonly HasVisualShield = true

	private cachedShield = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
			this.GetTotalConstantBlock.bind(this)
		]
	])

	protected GetTotalConstantBlock(): [number, boolean] {
		return [this.cachedShield - this.NetworkDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedShield = this.GetSpecialValue("barrier", "furion_teleportation")
	}
}
